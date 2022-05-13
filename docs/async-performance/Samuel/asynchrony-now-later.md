---
title: "Chapter 1: Asynchrony: Now & Later"
tags: [asynchrony]
sidebar_position: 1
---

## 들어가며

---

자바스크립트와 같은 언어로 프로그래밍 할 때 종종 오해하는 부분은 **일정 기간 동안 프로그램 동작을 표현하고 조작하는 방법**입니다.

- 단순히 `for` 루프의 시작과 끝 같은 것이 아닌 **일부가 실행되고 다른 부분이 나중에 실행될 때**와 같은 것을 의미하며, 이것이 **비동기 프로그래밍**의 핵심입니다.

해당 장에선 비동기 자바스크립트 프로그래밍을 위한 다양한 새로운 기술을 탐색할 것이기에, 비동기가 무엇이며 자바스크립트에서 어떻게 동작하는지 훨씬 더 깊이 이해해야할 것입니다.

<br/>

### A Program in Chunks

---

하나의 파일에 자바스크립트 프로그램을 작성할 수 있지만, 대부분 여러 청크로 구성되며 하나만 실행되고 나머진 나중에 실행됩니다.

> 청크의 가장 일반적인 단위는 함수입니다.

자바스크립트를 처음 접하면 가장 익숙하지 않은 부분은 비동기 작업이 직관적으로 바로 발생하지 않는다는 점입니다.

```js
// ajax(..) is some arbitrary Ajax function given by a library
var data = ajax("http://some.url.1");

console.log(data);
// Oops! `data` generally won't have the Ajax results
```

위 경우에 **응답이 돌아올 때까지 `ajax(...)` 의 동작이 차단**될 수 있으면 `data` 에 할당이 정상적으로 작동합니다.

- 위 동작은 **콜백 함수**를 통해 가능합니다.

```js
// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", function myCallbackFunction(data) {
  console.log(data); // Yay, I gots me some `data`!
});
```

> 동기 방식의 Ajax 요청을 만들 수 있지만, 사용자 인터랙션을 다 막고 싶다면 그렇게 해도 됩니다.

그렇기에 콜백 혼란을 피하려는 것은 동기 방식 Ajax를 위한 정당화가 되지 않습니다.

```js
function now() {
  return 21;
}

function later() {
  answer = answer * 2;
  console.log("Meaning of life:", answer);
}

var answer = now();

setTimeout(later, 1000); // Meaning of life: 42
```

이를 명시적으로 표현하면 다음과 같습니다.

```js
// Now
function now() {
  return 21;
}
function later() {
  // ...
}

var answer = now();

setTimeout(later, 1000);
```

```js
// Later
answer = answer * 2;
console.log("Meaning of life:", answer);
```

코드 일부를 **함수로 래핑**하고 특정 이벤트에 대한 응답으로 실행될 때마다 나중에 해당 코드를 **비동기적으로** 실행합니다.

### Async Console

---

때때로 `console.log(...)` 가 실제로 주어진 내용을 즉시 출력하지 않는 브라우저와 일부 조건이 있습니다.

- 주된 이유는 I/O가 매우 느리고 많은 프로그램의 일부를 차단하기 때문입니다.
- 그렇기에, `console` I/O를 비동기식으로 처리하는 것이 더 나은 성능을 보일 수 있습니다.

```js
var a = { index: 1 };
// later
console.log(a); // ??
// even later
a.index++;
```

이 경우 `{ index: 1 }` 을 출력하지만 동일한 코드 내에서 `console` I/O를 백그라운드로 연기할 필요가 있다고 느끼는 상황에선 `{ index: 2 }` 를 반환합니다.

> 이런 드분 시나리오에 직면하는 경우 가장 좋은 옵션은 `console` 출력에 의존하는 대신에 자바스크립트 디버거에서 **breakpoints를 활용하는 것**입니다.

<br/>

## Event Loop

---

충격적일 수 있지만 자바스크립트 비동기 코드를 확실히 작성할 수 있음에도 불구하고 ES6까지 자바스크립트 자체는 **실제로 비동기에 대한 직접적인 개념이 내장되어 있지 않았습니다.**

> 자바스크립트 엔진 자체는 요청이 있을 때, 단일 청크 외 다른 것을 수행한 적이 없습니다!

자바스크립트 엔진은 독립적으로 실행되지 않으며, 대개 웹 브라우저인 **호스팅 환경**에서 실행이 됩니다.

- 이러한 환경 내 **스레드**는 **이벤트 루프**라고 하는 자바스크립트 엔진을 호출하는 매 순간마다 여러 청크 실행을 처리하는 메커니즘이 있습니다.
- 다시 말해, 자바스크립트 엔진은 타고난 시간 감각은 없지만 임의의 스니펫에 대한 주문형 실행 환경이었습니다.

예를 들어, 자바스크립트 프로그램이 데이터를 가져오기 위해 **Ajax 요청**을 할 때, 함수에 **응답 코드(일반적으로 콜백)를 설정**합니다.

- 이후 사용자에게 제공할 항목이 있을 때 **이벤트 루프**에 삽입하여 콜백 함수가 실행되도록 예약합니다.

이벤트 루프는 무엇일까요?

```js
// `eventLoop` is an array that acts as a queue (first-in, first-out)
var eventLoop = [];
var event;

// keep going "forever"
while (true) {
  // perform a "tick"
  if (eventLoop.length > 0) {
    // get the next event in the queue
    event = eventLoop.shift();

    // now, execute the next event
    try {
      event();
    } catch (err) {
      reportError(err);
    }
  }
}
```

간단히 설명하자면 연속적인 루프 내 **틱(tick)**이라는 동작을 반복하며 각 틱에 대해 **대기 중인 이벤트가 제거되며 실행**됩니다.

- `setTimeout()` 이 루프 대기열에 콜백을 넣지 않는다는 것을 유의합시다.
  - 이미 이벤트 루프에 다수의 항목이 있다면 콜백한 지정한 시간 간격 안에 실행되지 않을 것입니다.

즉, 프로그램은 일반적으로 이벤트 루프 대기열에서 차례로 발생하는 많은 작은 덩어리로 나뉩니다.

<div style={{display: "flex", alignItems: "center", flexDirection: "column", border: "1px solid gray", borderRadius: "8px", padding: "20px", marginBottom: '1.5rem'}}>
  <h3>NOTE</h3>
  <span>ES6는 이제 이벤트 루프가 작동하는 방식을 결정하며, 기술적으로 호스팅 환경이 아닌 자바스크립트 엔진 범위 내에 있습니다.</span>
</div>

<br/>

## Parallel Threading

---

비동기(async)와 병렬(parallel)이라는 용어를 혼동하는 것은 매우 일반적이지만 실제로는 상당히 다릅니다.

- 비동기는 지금과 나중 사이의 간격에 관한 것이고 병렬은 동시에 발생할 수 있는 일입니다.

병렬 컴퓨팅을 위한 가장 일반적인 도구는 **프로세스**와 **스레드**입니다.

- 두 가지는 **독립적으로 실행되고 동시에 실행**될 수 있으며, 별도의 프로세스 또는 별도의 컴퓨터에서 실행되지만 **여러 스레드가 단일 프로세스의 메모리를 공유할 수 있습니다.**

이와 대조적으로 이벤트 루프는 **작업으로 나누고 직렬로 실행**하여 병렬 액세스 및 공유 메모리 변경을 허용하지 않습니다.

- 병렬 및 직렬은 별도의 스레드에서 이벤트 루프를 협력하는 형태로 공존할 수 있습니다.
- 병렬 실행 스레드의 인터리빙과 비동기 이벤트의 인터리빙은 매우 다른 수준의 세분성(Granularity)에서 발생합니다.

> **인터리빙(interleaving):** 유선 통신 네트워크 또는 무선 통신 구간을 통하여 트래픽을 전송할 때, 발생할 수 있는, 군집 에러를 랜덤 에러로 변환하여, 에러 정정을 용이하게 하기 위하여 사용되는 기법.
>
> **세분성(Granularity):** 해당 작업이 수행하는 작업(또는 계산)의 양을 측정한 것

```js
function later() {
  answer = answer * 2;
  console.log("Meaning of life:", answer);
}
```

`later()` 의 전체 내용은 **단일 이벤트 루프 대기열 항목**으로 간주되지만, 이 코드가 실행될 스레드에 대해 생각할 때 실제로는 12가지 다른 저수준 작업이 있을 수 있습니다.

- 예를 들어, `answer = answer * 2` 는 먼저 현재 값 `answer` 를 로드한 다음 `2` 를 어딘가에 넣은 다음 곱셈을 수행한 다음 결과를 가져와서 `answer` 에 다시 저장해야 합니다.

단일 스레드 환경에서는 **스레드를 인터럽트할 수 있는 항목이 없기 때문에**, 스레드 대기열의 항목이 저수준 작업이라는 것은 중요하지 않습니다.

- 그러나 두 개의 다른 스레드가 동일한 프로그램에서 작동하는 **병렬 시스템이 있는 경우 예측할 수 없는 동작이 발생할 가능성이 매우 높습니다.**

```js
var a = 20;

function foo() {
  a = a + 1;
}

function bar() {
  a = a * 2;
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", foo);
ajax("http://some.url.2", bar);
```

자바스크립트 단일 스레드 동작에서 `foo()` 가 `bar()` 전에 실행되면 결과는 `a` 가 `42` 이지만 `bar()` 가 `foo()` 전에 실행되면 `a` 의 결과는 `41` 이됩니다.

- 하지만 병렬로 실행된다면 문제는 훨씬 더 미묘할 것입니다.

```js
// Thread 1 ( X and Y are temporary memory locations):

foo():
a. load value of `a` in `X`
b. store `1` in `Y`
c. add `X` and `Y`, store result in `X` d. store value of `X` in `a`
```

```js
// Thread 2 ( X and Y are temporary memory locations):

bar():
a. load value of `a` in `X`
b. store `2` in `Y`
c. multiply `X` and `Y`, store result in `X` d. store value of `X` in `a`
```

두 스레드가 병렬로 실행된다고 가정하면, 임시 단계를 위해 `X` 와 `Y` 를 사용합니다.

```js
1a (load value of `a` in `X` ==> `20`) 2a (load value of `a` in `X` ==> `20`) 1b (store `1` in `Y` ==> `1`)
2b (store `2` in `Y` ==> `2`)
1c (add `X` and `Y`, store result in `X`
1d (store value of `X` in `a` ==> `22`)
2c (multiply `X` and `Y`, store result in `X` ==> `44`) 2d (store value of `X` in `a` ==> `44`)
```

위 경우 `a` 의 결과는 `44` 입니다. 다음 코드는 어떨까요

```js
1a (load value of `a` in `X` ==> `20`) 2a (load value of `a` in `X` ==> `20`)
2b (store `2` in `Y` ===> '2')
1b (store `1` in `Y` ===> '1')
2c (multiply `X` and `Y`, store result in `X` ==> `20`)
1c (add `X` and `Y`, store result in `X` ==> `21`)
1d (store value of `X` in `a` ==> `21`) 2d (store value of `X` in `a` ==> `21`)
```

`a` 결과는 `21` 입니다.

따라서 스레드 프로그래밍은 매우 까다롭고 이러한 종류의 중단/인터리빙이 발생하는 것을 방지하기 위한 특별한 조치를 취하지 않는다면, 예상치 못한 결과를 얻을 수 있습니다.

자바스크립트는 스레드 간 데이터 공유가 없기에 비결정성 수준은 문제가 되지 않지만, 이것이 자바스크립트가 항상 결정적이라는 것을 의미하진 않습니다.

<div style={{display: "flex", alignItems: "center", flexDirection: "column", border: "1px solid gray", borderRadius: "8px", padding: "20px", marginBottom: '1.5rem'}}>
  <h3>NOTE</h3>
  <span>모든 비결정론이 나쁜 것은 아닙니다. 때로는 관련이 없고 때로는 의도적입니다.</span>
</div>

<br/>

### Run-to-Completion

---

자바스크립트의 단일 스레딩 때문에 `foo()` 함수 내부 코드는 원자적입니다.

- 즉, `foo()` 가 실행되면 `bar()` 코드가 실행되기 전에 전체 코드가 완료됩니다.
- 실행하거나 그 반대의 경우도 마찬가지입니다.

이것을 **run-to-completion**이라고 합니다.

사실 run-to-completion의 의미는 `foo()` 및 `bar()` 에 다음과 같이 더 많은 코드가 있을게 분명합니다.

```js
var a = 1;
var b = 2;

function foo() {
  a++;
  b = b * a;
  a = b + 3;
}

function bar() {
  b--;
  a = 8 + b;
  b = a * 2;
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", foo);
ajax("http://some.url.2", bar);
```

서로의 함수에 의해 중단될 수 없기에, 실행 순서에 따라 두 가지 가능한 결과만 가질 수 있습니다.

```js
// Chunk 1:
var a = 1;
var b = 2;
```

```js
// Chunk 2 ( foo() ):
a++;
b = b * a;
a = b + 3;
```

```js
// Chunk 3 ( bar() ):
b--;
a = 8 + b;
b = a * 2;
```

- 청크 1은 동기식이지만 청크 2와 3은 비동기식으로 실행됩니다.
- 청크 2와 3은 첫 번째 순서로 발생할 수 있으므로 다음과 같이 이 프로그램에 대해 두 가지 가능한 결과가 있습니다.

```js
//Outcome 1:
var a = 1;
var b = 2;

// foo()
a++;
b = b * a;
a = b + 3;

// bar()
b--;
a = 8 + b;
b = a * 2;

a; // 11
b; // 22
```

```js
// Outcome 2:
var a = 1;
var b = 2;

// bar()
b--;
a = 8 + b;
b = a * 2;

// foo()
a++;
b = b * a;
a = b + 3;

a; // 183
b; // 180
```

동일한 두 가지 결과는 여전히 비결정성이 있음을 의미합니다.

- 그러나 그것은 스레드에서와 같이 명령문 순서 레벨(또는 실제로 표현식 연산 순서 레벨)이 아니라 **함수(이벤트) 순서 레벨**에 있습니다.

즉, 스레드보다 더 결정적입니다.

자바스크립트 동작에 적용되는 이 함수 순서 비결정론은 **경쟁 조건(race condition)**이라는 일반적인 용어입니다.

- `foo()` 와 `bar()` 가 어느 것이 먼저 실행되는지 보기 위해 서로 경쟁하기 때문입니다.
- 특히, `a` 와 `b` 가 어떻게 나올지 예측할 수 없기에 경쟁 조건입니다.

<br/>

## Concurrency

---

사용자가 목록을 아래로 스크롤할 때 점진적으로 로드되는 상태 업데이트 목록(예: 소셜 네트워크 뉴스 피드)을 표시하는 사이트를 상상해 봅시다.

- 이러한 기능이 올바르게 작동하도록 하려면 **(최소한) 두 개의 개별 프로세스가 동시에 실행되어야 합니다.**

<div style={{display: "flex", alignItems: "center", flexDirection: "column", border: "1px solid gray", borderRadius: "8px", padding: "20px", marginBottom: '1.5rem'}}>
  <h3>NOTE</h3>
  <span>여기서 프로세스란 논리적 의미의 연결된 순차적인 일련의 작업을 나타내는 가상 프로세스 또는 작업입니다.</span>
</div>

- 첫 번째 프로세스는 `onScroll` 이벤트(새 콘텐츠에 대한 Ajax 요청 생성)에 응답합니다.
- 두 번째 프로세스는 `Ajax` 응답을 다시 수신합니다.

동시성은 개별 구성 작업이 병렬로 발생하는지 여부에 상관 없이 **두 개 이상의 프로세스가 동일한 기간 동안 동시에 실행되는 경우**입니다.

- 동시성은 작업 수준 병렬 처리와 반대되는 프로세스 수준 병렬 처리로 생각할 수 있습니다.

<div style={{display: "flex", alignItems: "center", flexDirection: "column", border: "1px solid gray", borderRadius: "8px", padding: "20px", marginBottom: '1.5rem'}}>
  <h3>NOTE</h3>
  <span>동시성은 서로 상호 작용하는 이러한 프로세스에 대한 선택적 개념도 도입합니다.</span>
</div>

이를 시각화하면 다음과 같습니다.

```js
// process 1
onscroll, request 1
onscroll, request 2
onscroll, request 3
onscroll, request 4
onscroll, request 5
onscroll, request 6
onscroll, request 7
```

```js
// process 2
response 1
response 2
response 3
response 4
response 5
response 6
response 7
```

`onscroll` 이벤트와 Ajax 응답 이벤트가 정확히 같은 순간에 처리될 가능성이 큽니다.

이를 다음과 같이 시각화할 수 있습니다.

```js
// process 3
onscroll, request 1
onscroll, request 2     response 1
onscroll, request 3     response 2
response 3
onscroll, request 4
onscroll, request 5
onscroll, request 6     response 4
onscroll, request 7
response 6
response 5
response 7
```

그러나 앞선 이벤트 루프 개념으로 돌아가서 자바스크립트는 **한 가지 이벤트만 처리할 수 있으므로** `onscroll`, 요청 2가 먼저 발생하거나 응답 1이 먼저 발생합니다.

모든 이벤트의 인터리빙을 시각화하면 다음과 같습니다.

```js
onscroll, request 1     <--- Process 1 starts
onscroll, request 2
response 1              <--- Process 2 starts
onscroll, request 3
response 2
response 3
onscroll, request 4
onscroll, request 5
onscroll, request 6
response 4
onscroll, request 7     <--- Process 1 finishes
response 6
response 5
response 7              <--- Process 2 finishes
```

"프로세스 1" 및 "프로세스 2"는 동시에 실행되지만(작업 수준 병렬), 개별 이벤트는 이벤트 루프 대기열에서 순차적으로 실행됩니다.

단일 스레드 이벤트 루프는 동시성의 한 표현입니다.

<br/>

### Noninteracting

---

둘 이상의 프로세스가 동일한 프로그램 내에서 동시에 단계/이벤트를 인터리빙하므로 작업이 관련되지 않는 경우 **서로 상호 작용할 필요가 없습니다.**

- 그들이 상호 작용하지 않는다면 비결정론은 완벽하게 받아들여질 수 있습니다.

```js
var res = {};

function foo(results) {
  res.foo = results;
}
function bar(results) {
  res.bar = results;
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", foo);
ajax("http://some.url.2", bar);
```

`foo()` 및 `bar()` 는 두 개의 동시 프로세스이며 실행될 순서는 결정되지 않습니다.

- 그러나 실행 순서가 중요하지 않도록 프로그램을 구성했기에, 상호 작용할 필요가 없습니다.
- 코드는 순서에 관계없이 항상 올바르게 작동하므로 이것은 경쟁 조건 버그가 아닙니다.

<br/>

### Interaction

---

더 일반적으로 동시 프로세스는 스코프와 DOM을 통해 간접적으로 필요에 따라 상호 작용합니다.

- 경쟁 조건을 방지하기 위해 이러한 상호 작용을 조정해야 합니다.

```js
var res = [];

function response(data) {
  res.push(data);
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", response);
ajax("http://some.url.2", response);
```

동시 프로세스는 Ajax 응답을 처리하기 위해 만들어지는 두 개의 `response()` 호출입니다.

`res[0]` 에 `"http://some.url.1"` 호출 결과가 있고 `res[1]` 에 `"http://some.url.2"` 결과가 있다고 예상되는 동작을 가정해 보겠습니다.

- 이러한 경쟁 조건을 해결하기 위해 요청 상호 작용을 조정할 수 있습니다.

```js
var res = [];

function response(data) {
  if (data.url == "http://some.url.1") {
    res[0] = data;
  } else if (data.url == "http://some.url.2") {
    res[1] = data;
  }
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", response);
ajax("http://some.url.2", response);
```

어떤 Ajax 응답이 먼저 반환되는지에 관계없이 `data.url` 을 검사하여 `res` 배열에서 응답 데이터가 차지하는 위치를 파악합니다.

- 간단한 조정을 통해 경쟁 조건 비결정성을 제거했습니다.

일부 동시성 시나리오는 조정된 상호 작용 없이 항상 중단됩니다.

```js
var a, b;

function foo(x) {
  a = x * 2;
  baz();
}

function bar(y) {
  b = y * 2;
  baz();
}

function baz() {
  console.log(a + b);
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", foo);
ajax("http://some.url.2", bar);
```

해당 예시에서 `foo()` 또는 `bar()` 가 먼저 실행되는지 여부에 관계없이 항상 `baz()` 가 너무 일찍 실행되지만, `baz()` 의 두 번째 호출은 `a` 와 `b` 를 모두 사용할 수 있어서 작동합니다.

- 이러한 상태를 해결하는 다양한 방법이 있습니다.

```js
var a, b;

function foo(x) {
  a = x * 2;

  if (a && b) {
    baz();
  }
}

function bar(y) {
  b = y * 2;

  if (a && b) {
    baz();
  }
}

function baz() {
  console.log(a + b);
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", foo);
ajax("http://some.url.2", bar);
```

`baz()` 호출 주변의 `if(a && b)` 조건은 전통적으로 "게이트"라고 부릅니다.

- 왜냐하면 `a` 와 `b` 가 어떤 순서로 도착할지 확신할 수 없기 때문입니다.
- 마주칠 수 있는 또 다른 동시성 상호 작용 조건을 "경주"라고 하지만 더 정확하게는 "래치"라고 합니다.

여기에서 비결정론은 허용됩니다.

```js
var a;

function foo(x) {
  a = x * 2;
  baz();
}

function bar(x) {
  a = x / 2;
  baz();
}

function baz() {
  console.log(a);
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", foo);
ajax("http://some.url.2", bar);
```

`foo()` 혹은 `bar()` 중 하나가 마지막으로 실행되는 것은 다른 것에서 할당된 값을 덮어쓸 뿐만 아니라 `baz()` 에 대한 호출도 복제합니다.

따라서 간단한 래치로 상호 작용을 조정하여, 첫 번째 래치만 통과시킬 수 있습니다.

```js
var a;

function foo(x) {
  if (!a) {
    a = x * 2;
    baz();
  }
}

function bar(x) {
  if (!a) {
    a = x / 2;
    baz();
  }
}

function baz() {
  console.log(a);
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", foo);
ajax("http://some.url.2", bar);
```

`if (!a)` 조건은 둘 중 첫 번째 호출만 허용합니다.

<br/>

### Cooperation

---

동시성 조정(cooperation coordination)은 다른 말로 협동적 동시성(cooperative concurrency)이라고 한다.

- 여기서는 **장기간 실행되는 "프로세스"를 단계 또는 배치로 분할하여 다른 동시 "프로세스"가 해당 작업을 이벤트 루프 대기열에 삽입할 기회를 갖도록 하는 것**을 목표로 합니다.

```js
var res = [];
// `response(..)` receives array of results from the Ajax call
function response(data) {
  // add onto existing `res` array
  res = res.concat(
    // make a new transformed array with all `data` values doubled
    data.map(function (val) {
      return val * 2;
    })
  );
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", response);
ajax("http://some.url.2", response);
```

결과 목록 전체를 한 번에 `res` 에 매핑하는 것은 일반적으로 큰 문제가 아니지만, 천 만개의 레코드가 있는 경우 실행하는데 시간이 좀 걸릴 수 있습니다.

- 해당 프로세스가 실행되는 동안 페이지에서 어떠한 일도 발생할 수 없는 것은 참 고통스러울 것입니다.

그렇기에 보다 더 협력적인 동시 시스템을 만들기 위해서 해당 결과를 이벤트 루프 대기열을 차지하지 않는 시스템을 만들 수 있습니다.

```js
var res = [];

// `response(..)` receives array of results from the Ajax call
function response(data) {
  // let's just do 1000 at a time
  var chunk = data.splice(0, 1000);

  // add onto existing `res` array
  res = res.concat(
    // make a new transformed array with all `chunk` values doubled
    chunk.map(function (val) {
      return val * 2;
    })
  );

  // anything left to process?
  if (data.length > 0) {
    // async schedule next batch
    setTimeout(function () {
      response(data);
    }, 0);
  }
}

// ajax(..) is some arbitrary Ajax function given by a library
ajax("http://some.url.1", response);
ajax("http://some.url.2", response);
```

1,000개 항목의 최대 크기 청크로 데이터 세트를 처리합니다.

- 그렇게 함으로, 이벤트 루프 대기열에 성능이 더 좋은 사이트/앱을 제공하므로, 더 많은 후속 프로세스가 있어도 단기 실행되는 프로세스를 보장합니다.
- 물론, 프로세스의 순서를 조정하지 않기에 순서는 예측할 수 없습니다.

우리는 비동기 스케쥴링을 위해 `setTimeout(..0)(hack)` 을 사용하고, 이는 현재 이벤트 루프 큐의 끝에 이 함수를 고정한다는 뜻입니다.

<br/>

## Jobs

---

ES6 부터 이벤트 루프 큐 위에 **작업 큐(Job queue)**라는 새로운 개념이 추가되었습니다.

- 가장 비슷한 표현은 `Promise` 비동기 동작입니다.

해당 개념을 가장 잘 설명하는 것은 작업 큐가 **이벤트 루프 큐의 모든 틱 끝에 매달린 대기열이라는 것**입니다.

놀이기구로 비교하면 다음과 같습니다.

- 이벤트 루프 큐 = 놀이기구를 타고 뒤로 돌아가서 다시 타는 것
- 작업 대기열 = 타고 마친 후 줄을 서서 바로 다시 출발하는 것

작업(Job)으로 인해 큐 끝에 더 많은 작업이 추가될 수 있기에, 이론적으로 작업 루프를 무한으로 돌려 프로그램이 다음 이벤트 루프 틱으로 이동하는 기능을 고갈시킬 수 있습니다.

- 이것은 개념적으로 무한 루프를 표현하는 것과 거의 같습니다.

작업은 일종의 `setTimeout(...0)` hack과 비슷하지만 훨씬 더 잘 정의되고 보장된 순서를 갖는 방식으로 구현됩니다.

작업을 예약(scheduling)하기 위한 API를 상상하고 그것을 `schedule(..)` 이라 불러봅시다.

```js
console.log("A");

setTimeout(function () {
  console.log("B");
}, 0);

// theoretical "Job API"
schedule(function () {
  console.log("C");

  schedule(function () {
    console.log("D");
  });
});
```

`A B C D` 를 출력할 것이라고 예상하지만, 작업이 현재 이벤트 루프(`console.log("A")`) 끝에서 발생하고 타이머가 다음 이벤트 루프 틱에 대한 일정을 잡기 위해 실행되기 때문에 `A C D B` 를 출력합니다.

<br/>

## Statement Ordering

---

코드에서 명령문을 표현하는 순서는 자바스크립트 엔진이 실행하는 순서와 반드시 같을 필요는 없습니다.

> 이는 매우 이상한 주장처럼 보일 수 있으므로 간단히 살펴보겠습니다.

```js
var a, b;

a = 10;
b = 30;

a = a + 1;
b = b + 1;

console.log(a + b); // 42
```

위 코드는 비동기식으로 표현되지 않았기에 가정은 하향식 처리가 될 것입니다.

- 하지만 자바스크립트 엔진이 해당 코드를 컴파일하고 재정렬하여 최적화를 할 수 있습니다.

```js
var a, b;

a = 10;
a++;

b = 30;
b++;

console.log(a + b); // 42
```

또는,

```js
var a, b;

a = 11;
b = 31;

console.log(a + b); // 42
```

또는,

```js
// because `a` and `b` aren't used anymore, we can
// inline and don't even need them!
console.log(42); // 42
```

위 모든 경우는 최종적인 예측 가능 결곽 동일하기에 컴파일하는 동안 최적화를 수행할 수 있습니다.

다음의 경우 특정 최적화가 안전하지 않아 허용될 수 없는 시나리오입니다(물론 최적화되지 않았다는 것은 아닙니다).

```js
var a, b;

a = 10;
b = 30;

// we need `a` and `b` in their preincremented state!
console.log(a * b); // 300 a = a + 1;

b = b + 1;

console.log(a + b); // 42
```

컴파일러 재정렬이 예측 가능한 부작용을 생성할 수 있는 다른 예시에는 부작용이 있는 함수 호출 또는 ES6 프록시 객체가 포함됩니다.

```js
function foo() {
  console.log(b);
  return 1;
}

var a, b, c;

// ES5.1 getter literal syntax
c = {
  get bar() {
    console.log(a);
    return 1;
  },
};

a = 10;
b = 30;

a += foo(); // 30
b += c.bar; // 11

console.log(a + b); // 42
```

해당 코드의 `console.log()` 문이 아니었다면, 자바스크립트 엔진은 자유롭게 코드를 다음과 같이 재정렬했을 것입니다.

```js
// ...
a = 10 + foo();
b = 30 + c.bar;
// ...
```

자바스크립트 Semantics는 명령문 재정렬이 예측 가능한 위험으로부터 우리를 보호하지만, 소스 코드가 작성되는 방식과 실행되는 방식 사이의 연결이 얼마나 빈약한지를 이해하는 것은 여전히 중요합니다.
