---
slug: /up-going/samuel/into-javascript
title: Into Javascript
tags: [basics, programming, javascript]
sidebar_position: 2
---

<br />

## 들어가며 🏃

---

이전 파트에서 프로그래밍에 대한 기본적인 내용을 배웠다면, 이번 내용은 **자바스크립트 개발자로 일어서기 위한 내용**에 중점을 둡니다.

정확히 말하자면 **해당 시리즈의 나머지 부분에서 다루는 주제의 개요**라고 보는 것이 편합니다.

<br />

## Values & Types ❕

---

> **TL;DR 🔖**
>
> - 자바스크립트에는 **타입이 지정된 값**이 있으며 **자체적으로 제공하는 타입들**이 있습니다.
> - 타입을 확인하기 위한 **`typeof` 연산자**가 있으며, **7가지의 문자열 중 하나**를 반환합니다.
> - **객체**는 키와 값을 갖는 프로퍼티로 구성된 값 타입이며, **배열과 함수**라는 특수한 객체가 있습니다.

<br />

1장에서 말했듯이, 자바스크립트에는 타입이 지정된 변수가 아닌 **타입이 지정된 값**이 있습니다.

다음의 기본 제공 타입을 사용할 수 있습니다.

- `string`
- `number`
- `boolean`
- `null` and `undefined` • `object`
- `symbol` (new to ES6)

자바스크립트에선 이러한 **타입을 `typeof` 연산자를 통해 확인할 수 있습니다.**

```js
var a;
typeof a; // "undefined"

a = "hello world";
typeof a; // "string"

a = 42;
typeof a; // "number"

a = true;
typeof a; // "boolean"

a = null;
typeof a; // "object"--weird, bug

a = undefined;
typeof a; // "undefined"

a = { b: "c" };
typeof a; // "object"
```

- `typeof` 연산자의 반환값은 **항상 7가지 문자열 중 하나**입니다.
  - 즉, 값 `"abc"` 는 `string` 이 아닌 `"string"` 을 반환합니다.
- `typeof` 는 변수의 타입이 아닌 **변수 안의 값에 대한 타입**을 반환하는 것을 알아야합니다.
  - 변수는 단순한 컨테이너입니다.
- **`typeof null`**은 `"null"` 을 반환할 것 같지만 **`"object"` 를 반환합니다.**
  - 이는 자바스크립트가 갖는 오래된 오류지만 이를 수정하면 발생하는 오류가 많기에 수정하지 않을 것입니다.
- `undefined` 를 할당한다고 **명시적으로 정의되지 않은 값**을 설정하지만, 이는 `var a` 와 같이 아직 할당하지 않은 값과 같은 경우에 해당합니다.
  - 그렇기에 **명시적으로 이를 표현하기 위해 변수에 `null` 혹은 함수 반환값에 `void` 를 할당**하여 해결할 수 있습니다.

<br />

### Object ❓

---

**객체(Object)** 타입은 **모든 타입의 고유한 값을 각각 보유한 프로퍼티를 갖는 복합적인 값**을 나타냅니다.

```ts
var obj = {
  a: "hello world",
  b: 42,
  c: true,
};

obj.a; // "hello world"
obj.b; // 42
obj.c; // true

obj["a"]; // "hello world"
obj["b"]; // 42
obj["c"]; // true
```

위 코드의 객체 `obj` 를 시각화하면 다음과 같이 표현할 수 있습니다.

<img src="/img/samuel/into-javascript/object.png" width="550" />

프로퍼티에 접근하는 방법은 **점 표기법(Dot notation : `.`)과 대괄호 표기법(Bracket notation : `[]`)**이 있습니다.

- 점 표기법은 **더 짧고 읽기 쉽기에** 주로 자주 사용합니다.
- 대괄호 표기법은 **동적 참조**가 가능합니다.
  - **변수 혹은 연산을 통한 결과**를 프로퍼티의 키 값으로 할당할 수 있습니다.

```js
var obj = {
  a: "hello world",
  b: 42,
};

var b = "a";

obj[b]; // "hello world"
obj["b"]; // 42
```

또한, 객체 타입이 특수화 된 **배열과 함수**라는 타입도 존재합니다.

<br />

#### Array

---

배열(Array)은 **프로퍼티의 키 값으로 숫자로 인덱싱 된 위치 값을 보유하는 객체**입니다.

```js
var arr = ["hello world", 42, true];

arr[0]; // "hello world"
arr[1]; // 42
arr[2]; // true
arr.length; // 3

typeof arr; // "object"
```

> 배열의 인덱싱은 0부터 시작합니다.

이를 시각화하면 다음과 같습니다.

<img src="/img/samuel/into-javascript/array.png" width="600" />

- 배열은 자동으로 업데이트 되는 **`length` 프로퍼티**도 가질 수 있습니다.
  - 배열도 객체와 같이 **명명된 프로퍼티**를 사용할 수 있지만, 이는 부적절한 사용으로 간주되며 이를 지양하고 **각 역할에 따라 구분지어 사용해야합니다.**

<br/>

#### Function

---

또 다른 객체 하위 유형으로 **함수(Function)**가 있습니다.

```js
function foo() {
  return 42;
}

foo.bar = "hello world";

typeof foo; // "function"
typeof foo(); // "number"
typeof foo.bar; // "string"
```

배열과 같이 함수 또한 **프로퍼티**를 가질 수 있지만, 이는 역시 부적절한 사용입니다.

- 그렇기에 위 `foo.bar` 와 같은 경우는 지양합니다.

<br/>

### Built-In Type Methods ❓

---

**내장 타입 및 하위 타입(Built-In Type Methods)**에는 유용한 **프로퍼티 및 메서드**가 있습니다.

```js
var a = "hello world";
var b = 3.14159;

a.length; // 11
a.toUpperCase(); // "HELLO WORLD"
b.toFixed(4); // "3.1416"
```

`a.toUpperCase()` 를 호출하는 것은 값에 존재하는 메서드보다 더 복잡합니다.

- 간단히 말해 기본 문자열 타입과 쌍을 이루는 `String` 객체 래퍼 형식(네이티브)이 해당 메서드(`toUpperCase`)를 정의합니다.
  - 프로퍼티나 메서드를 참조하여 **기본 값을 객체로 사용할 때** 해당 기본 값에 해당하는 **객체 래퍼에 이를 할당합니다.**
