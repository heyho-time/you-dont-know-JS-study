---
title: Chapter 4. Hoisting
tags: [hoisting]
sidebar_position: 4
---

<br/>

## 들어가며 🏃

---

이번 단원에서는 스코프 내 다양한 위치에 나타나는 선언과 함께 작동하는 방식의 미묘한 세부 사항에 대해 알아볼 것입니다.

<br/>

## Chicken or the Egg? ❕

---

자바스크립트 프로그램의 코드는 위에서부터 순차적으로 해석될 것이라고 생각하는 것이 실질적으로 사실이지만, 여기서 주의할 점이 있습니다.

```js
a = 2;

var a;

console.log(a);
```

위 코드는 `a = 2` 에서 암묵적 전역 변수 선언이 되고 `var a` 가 실행되어 최종적으로 할당된 `undefined` 가 콘솔에 출력될 것이라고 예상되지만 `2` 를 반환합니다.

```js
console.log(a);

var a = 2;
```

위 경우엔 `2` 를 출력하거나 `Reference Error` 를 발생시킨다고 예상할 수 있지만, `undefined` 를 반환합니다.

선언(계란)과 할당(닭) 중 어느 것이 먼저일까요?

<br/>

## The Compiler Strikes Again ❕

---

이 질문에 답하기 위해 이전에 언급했었던, **엔진이 자바스크립트 코드를 해석하기 이전에 컴파일을 한다**는 점을 기억해봅시다.

- 컴파일 단계의 일부는 **모든 선언을 찾고, 적절한 스코프에 연결하는 것**입니다.
- 따라서, 코드 일부가 실행되기 전에 **모든 선언이 먼저 처리된다는 것**입니다.

```js
var a = 2;
```

위 코드는 하나의 명령문으로 보이지만 실제론 `var a;` 와 `a = 2;` 로 구분되고 **전자는 컴파일 단계에서, 후자는 실행 단계에서 처리됩니다.**

그렇기에 앞의 코드들은 다음과 같이 처리된다고 이해할 수 있습니다.

```js
// 첫 번째 예시 코드
var a;

a = 2;

console.log(a);
```

```js
// 두 번째 예시 코드
var a;

console.log(a);

a = 2;
```

이 현상을 비유적으로 **함수 선언이 코드 최상단으로 이동한다는 것**이라고 이해할 수 있으며, 이를 **호이스팅(Hoisting)**이라고 합니다.

호이스팅은 선언만 끌어올리기 때문에 다음과 같은 혼란을 불러일으킬 수 있습니다.

```js
function foo() {
  var a;

  console.log(a); // undefined

  a = 2;
}

foo();
```

```js
foo(); // not ReferenceError, but TypeError!

var foo = function bar() {
  // ...
};
```

호이스팅은 **스코프를 기준으로** 이루어집니다. 그렇기에 이전 예시는 다음과 같이 표현할 수 있습니다.

```js
function foo() {
  var a;

  console.log(a); // undefined

  a = 2;
}

foo();
```

위와 같이 **함수 선언식**은 호이스팅 되지만, **함수 표현식**은 호이스팅 되지 않습니다.

```js
foo(); // not ReferenceError, but TypeError!

var foo = function bar() {
  // ...
};
```

위 경우에 변수 식별자 `foo` 가 호이스팅 되었지만, `foo` 에 값이 없기에 `foo()` 는 `undefined` 를 호출하는 격이며 `TypeError` 를 발생시킵니다.

명명 함수 표현식이어도 이는 마찬가지입니다.

```js
foo(); // TypeError

bar(); // ReferenceError

var foo = function bar() {
  // ...
};
```

위 코드는 다음과 같이 해석됩니다.

```js
var foo;

foo(); // TypeError

bar(); // ReferenceError

foo = function () {
  var bar = ... self ...
  // ...
};
```

<br/>

## Functions First ❕

---

함수 선언과 변수 선언 모두 호이스팅 되지만, **함수가 먼저 호이스팅 되고 변수가 호이스팅 됩니다.**

```js
foo(); // 1

var foo;

function foo() {
  console.log(1);
}

foo = function () {
  console.log(2);
};
```

위 경우 `2` 대신 `1` 이 출력되며 다음과 같이 해석할 수 있습니다.

```js
function foo() {
  console.log(1);
}

foo(); // 1

foo = function () {
  console.log(2);
};
```

`var foo` 는 중복 선언이고, 함수 `foo() ...` 선언보다 앞서 있었지만, 이는 무시되고 후속 함수 선언이 이를 재정의했습니다.

```js
foo(); // 3

function foo() {
  console.log(1);
}

var foo = function () {
  console.log(2);
};

function foo() {
  console.log(3);
}
```

위와 같은 결과를 보여주기에 중복 선언은 혼란스러운 결과를 초래할 수 있다는 사실이 강조됩니다.

```js
foo(); // "b"

var a = true;

if (a) {
  function foo() {
    console.log("a");
  }
} else {
  function foo() {
    console.log("b");
  }
}
```

> RunJS에서 실행했는데, `ReferenceError` 발생 함
