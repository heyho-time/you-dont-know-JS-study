---
title: Appendix A. ~ D.
tags: [appendix, dynamic-scope]
sidebar_position: 6
---

<br/>

## Appendix A. Dynamic Scope ❕

---

2장에서 정적 스코프와 대조되는 **동적 스코프**에 대해서 배웠고, 동적 스코프 메커니즘은 자바스크립트의 **`this` 의 메커니즘**과 유사합니다.

> 해당 메커니즘은 해당 책 시리즈 중 _this & Object Prototypes_ 에서 다룹니다.

- 동적 스코프는 코드 작성 시점에서 정의되는 정적 스코프와 달리 **런타임에 동적으로 결정될 수 있는 경우**를 의미합니다.

```js
function foo() {
  console.log(a); // 2
}

function bar() {
  var a = 3;

  foo();
}

var a = 2;

bar();
```

정적 스코프의 경우 `foo()` 의 `a` 에 대한 RHS 참조가 전역 변수 `a` 로 해석되어 값 `2` 가 출력되지만, 동적 스코프의 경우 **호출된 위치**와 관련이 있으며 스코프 체인은 중첩 스코프가 아닌 **호출 스택을 기반**으로 합니다.

- 따라서 자바스크립트에 동적 스코프가 있는 경우 `foo()` 가 실행될 때, 이론적으로 아래 코드는 `3` 을 출력해야 합니다.

```js
function foo() {
  console.log(a); // 3  (not 2!)
}

function bar() {
  var a = 3;

  foo();
}

var a = 2;

bar();
```

왜냐하면, `foo()` 의 변수 참조를 하기 위해 중첩 스코프 체인을 올리는 대신 **호출 스택**을 찾기 때문입니다.

- `foo()` 는 `bar()` 에서 호출되었기에 `bar()` 스코프를 참조한다.

실제로 자바스크립트에선 동적 스코프가 없기에 이러한 동작은 어색하게 느껴집니다.

> 정적 스코프는 코드 작성의 순간, 동적 스코프(및 `this`)는 런타임인 것을 기억합시다.

<br/>

## Appendix B. Polyfilling Block Scope ❕

---

3장에서 우리는 블록 스코프에 대해 알아봤으며, `with` 와 `catch` ES3 도입 이후 자바스크립트 내 작은 블록 스코프의 예시임을 알게되었습니다.

그러나 실질적으로 블록 스코프를 자유롭게 사용할 수 있게 된건 ES6의 `let` 도입 이후 입니다.

```js
{
  let a = 2;
  console.log(a); // 2
}

console.log(a); // ReferenceError
```

ES6 이전 기준으로는 다음과 같이 구현할 수 있습니다.

```js
try {
  throw 2;
} catch (a) {
  console.log(a); // 2
}

console.log(a); // ReferenceError
```

정말 보기 흉한 코드가 나왔네요. 위 코드는 `throw` 를 통해 `2` 를 전달하고, 단순히 `catch` 에서 이를 받아 출력합니다.

- 하지만 `catch` 절이 블록 스코프 지정을 할 수 있기에, ES6 이전 환경에서 폴리필로 활용할 수 있습니다.
  - 요점은 **도구가 ES6 코드를 변환하여 ES6 이전 환경에서 작동할 수 있다는 것**입니다.

<br/>

### Traceur ❓

---

구글은 **Traceur**라는 프로젝트를 유지 관리하는데, 해당 프로젝트는 **ES6 기능을 ES6 이전(대부분 ES5이지만 전부는 아님)으로 변환하는 작업을 수행**합니다.

- TC39 위원회는 해당 도구를 사용하여 지정된 기능의 의미를 테스트합니다.

```js
{
  try {
    throw undefined;
  } catch (a) {
    a = 2;
    console.log(a);
  }
}
console.log(a);
```

Traceur는 위와 같이 ES6 코드를 변환할 수 있으며, 이를 통해 ES6 지원 여부와 관계없이 블록 스코프를 활용할 수 있습니다.

<br/>

### Implicit Versus Explicit Blocks ❓

---

3장에서 블록 스코프 지정을 도입할 때, 코드 유지 관리/리팩토링 가능성에 대한 몇 가지 잠재적인 함정에 대해 언급한 바가 있습니다.

- 블록 스코프를 활용하는 것 외에 해당 단점을 줄이는 다른 방법이 있을까요?

다음의 `let` 블록 또는 `let` 문이라고 하는 대체 형식을 제시할 수 있습니다.

```js
let (a = 2) {
  console.log(a); // 2
}

console.log(a); // ReferenceError
```

위 `let` 문은 스코프 바인딩에 대한 명시적인 블록을 만든다는 점에서 강력한 코드 리팩토링과 모든 선언을 맨 위에 강제로 적용하여 다소 깨끗한 코드를 생성할 수 있습니다.

- 그러나 `let` 문 형식은 ES6에 포함되어 있지 않으며, 공식 Tracer 컴파일러도 해당 코드를 허용하지 않습니다.

이를 유효한 ES6 구문과 약간의 코드 규율을 통해 다음과 같이 활용할 수 있습니다.

```js
/*let*/ {
  let a = 2;
  console.log(a);
}

console.log(a); // ReferenceError
```

하지만 도구는 우리의 문제를 해결하기 위한 것이기 때문에, 다른 옵션은 명시적으로 `let` 문을 작성하고 도구가 이를 유효한 코드로 변환하도록 하는 것입니다.

그래서 이를 해결하기 위해 **let-er**라는 도구를 만들었습니다.

- let-er는 빌드 단계 코드 변환기이지만, **`let` 문 형식을 찾고 변환하는 것**이 유일한 작업입니다.

> 이후 let-er에 대한 설명... 생략하겠습니다...

```js
{
  let a = 2;
  console.log(a);
}

console.log(a); // ReferenceError
```

위와 같이 변환한다고 합니다.

<br/>

### Performance ❓

---

마지막으로 `try/catch` 에 대한 간단한 메모를 추가하거나 스코프 생성을 위해 IIFE를 사용하지 않는 이유는 다음과 같습니다.

- 첫째, `try/catch` 의 성능은 더 느리지만, 그렇게 되어야만 하거나 항상 그렇게 될 것이라는 합리적 가정이 없습니다.
- 둘째, IIFE와 `try/catch` 의 비교는 공정하지 않습니다.
  - 임의의 코드를 감싸는 함수가 해당 코드 내부에서 `return`, `break`, `continue` 를 계속 변형시킵니다.

<br/>

## Appendix C. Lexical this ❕

---

해당 타이틀에선 `this` 와 연관이 있는 ES6의 **화살표 함수**에 대해 다룹니다.

```js
var foo = (a) => {
  console.log(a);
};

foo(2); // 2
```

화살표 함수는 함수를 축약해서 작성할 수 있다는 장점이 있지만, 이외에도 중요한 부분이 있습니다.

```js
var obj = {
  id: "awesome",
  cool: function coolFn() {
    console.log(this.id);
  },
};

var id = "not awesome";

obj.cool(); // awesome

setTimeout(obj.cool, 100); // not awesome
```

위 코드는 **`cool()` 함수에서 바인딩이 손실된다는 문제**를 갖습니다.

- 이 문제에 대한 대표적인 해결책은 `var self = this` 입니다.

```js
var obj = {
  count: 0,
  cool: function coolFn() {
    var self = this;

    if (self.count < 1) {
      setTimeout(function timer() {
        self.count++;
        console.log("awesome?");
      }, 100);
    }
  },
};

obj.cool(); // awesome?
```

여기서 중요한 부분은 `var self = this` 는 우리가 더 이해하기 쉬운 정적 스코프 형태로 바꿀 수 있다는 점입니다.

- `self` 는 정적 스코프와 클로저를 통해 해결할 수 있는 식별자가 되어 해당 바인딩에 어떤 일이 일어났는지 신경쓰지 않습니다.

사람들은 장황한 코드를 쓰는 것을 좋아하지 않기에, 화살표 함수로 다음과 같이 수정할 수 있습니다.

```js
var obj = {
  count: 0,
  cool: function coolFn() {
    if (this.count < 1) {
      setTimeout(() => {
        // arrow-function ftw?
        this.count++;
        console.log("awesome?");
      }, 100);
    }
  },
};

obj.cool(); // awesome?
```

간단하게 설명하면, 화살표 함수는 일반적인 함수와 같이 바인딩 동작을 하지 않습니다.

- 해당 정적 스코프의 `this` 를 가져옵니다.

위 경우 `cool()` 함수의 `this` 바인딩을 상속합니다.

<div style={{display: "flex", alignItems: "center", flexDirection: "column", border: "1px solid gray", borderRadius: "8px", padding: "20px", marginBottom: '1.5rem'}}>
  <h3>NOTE</h3>
  <span>화살표 함수의 또 다른 단점은 익명이라는 점입니다. 익명이 덜 바람직한 이유는 3장을 참조하세요</span>
</div>

필자는 해당 메커니즘을 올바르게 수용하는 것이 적절한 접근 방식이라고 생각합니다.

```js
var obj = {
  count: 0,
  cool: function coolFn() {
    if (this.count < 1) {
      setTimeout(
        function timer() {
          this.count++; // `this` is safe
          // because of `bind(..)`
          console.log("more awesome");
        }.bind(this),
        100
      ); // look, `bind()`!
    }
  },
};

obj.cool(); // more awesome
```

화살표 함수의 새로운 정적 `this` 동작을 선호하든, 검증된 `bind()` 를 선호하든 **화살표 함수는 단순히 함수를 축약하는게 아니라는 점을 유의하는 것**이 중요합니다.

<br/>

## Appendix D. Acknowledgments ❕

---

> 어 음... 사실상 땡스 투라 그냥 스킵...✂️
