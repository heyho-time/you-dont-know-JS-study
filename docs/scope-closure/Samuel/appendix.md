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
