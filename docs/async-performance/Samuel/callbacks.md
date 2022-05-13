---
title: "Chapter 2: Callbacks"
tags: [callback]
sidebar_position: 2
---

## 들어가며

---

1장에선 자바스크립트 비동기 프로그래밍과 관련된 용어와 개념을 살펴보았습니다.

2장에서 다룰 **콜백(callback)**은 자바스크립트 내 가장 일반적인 비동기 관리 패턴입니다.

이 장에서 우리는 더 정교한 비동기 패턴(이 책의 다음 장에서 탐구)이 왜 필요하고 바람직한 지에 대한 동기로서 그 중 몇 가지를 심층적으로 탐색할 것입니다.

<br/>

## Continuations

---

```js
 // A
ajax( "..", function(..){
    // C
} );
// B
```

`// A` 와 `// B` 는 프로그램의 전반부(현재)를 나타내고 `// C` 는 프로그램의 후반부(나중)를 나타냅니다.

- 전반부가 즉시 실행되고 불확실한 일시 정지가 있은 뒤, Ajax 호출이 완료되면 프로그램은 중단된 부분부터 다시 시작하여 후반부를 계속합니다.

다시 말해, 콜백 함수는 **프로그램의 연속을 감싸거나 캡슐화**합니다.

코드를 더 간단히 해보겠습니다.

```js
// A
setTimeout(function () {
  // C
}, 1000);
// B
```

프로그램 작동 방식을 예측해보면 아마 다음과 같을 것입니다.

> A를 수행한 다음 1,000밀리초 동안 대기하도록 타임아웃을 설정한 다음 실행되면 C를 수행하십시오."

이후 이렇게 수정했을 수도 있습니다.

> "A를 수행하고 1,000밀리초 동안 시간 초과를 설정한 다음 B를 수행하고 시간 초과가 발생한 후 C를 수행하십시오."

두 번째 버전이 더 정확하긴 하지만 우리의 사고와 코드 동작 방식을 일치시키기엔 아직 부족합니다.

<br/>

## Sequential Brain

---

누군가 나는 멀티 태스킹이 가능한 사람이다라는 것을 들어본 경험이 있을 것입니다.

> 정말 멀티 태스킹이 가능할까요? 뇌 기능에 병렬 멀티스레딩이 있을까요?

아마도 아닐 것이며, 사람들은 주어진 순간에 한 가지만 생각할 수 있습니다.

- 여기서 말하는 것은 심작 박동, 호흡 및 눈꺼풀 깜빡임과 같은 것이 아닙니다.

우리가 멀티 태스킹이라고 말하는 것은 **각 작업을 작고 빠른 덩어리로 전환하면서 진행하는 것**일 겁니다.

> 이를 너무 빨리해서 병렬로 진행하는 것처럼 보이는 것이지요

엄청나게 복잡한 신경학 세계를 단순화하는 방법은 우리의 두뇌가 이벤트 루프 대기열처럼 작동한다는 것입니다.

- 문자를 입력하는 행위를 **단일 비동기 이벤트**로 생각하면, 다른 이벤트에 의해 두뇌의 동작이 중단될 수 있는 순간이 있을 것입니다.
- 그 과정에서 순간마다 다른 **프로세스**로 끌려가지 않으며, 다양한 **컨텍스트**로 전환하고 있다고 느낄 수 있습니다.

이는 자바스크립트에서 느낄 수 있는 것과 매우 유사할 것입니다.

<br/>

### Doing Versus Planning

---

좋습니다. 우리의 두뇌는 자바스크립트 엔진과 마찬가지로 단일 스레드 이벤트 루프 대기열에서 작동하는 것으로 생각할 수 있다는 것까지 알았습니다.

- 그런데 작동 수준에서 우리의 두뇌는 비동기 이벤트가 발생하지만 **순차적이고 동기적인 방식**으로 작업을 계획하는 것 같습니다.
- 예를 들어, 일(A, B, C)의 순서를 B가 A를, C가 B를 기다리도록 하는 일시적 차단을 가정합니다.

동기 코드를 작성하고자 할 때 심부름 할 일 목록과 매우 유사하게 작동합니다.

```js
// swap `x` and `y` (via temp variable `z`)
z = x;
x = y;
y = z;
```

위 세 개의 할당문은 동기식이므로 위에서부터 차례로 실행을 기다립니다.

그렇다면 비동기식 코드를 계획하는 것은 어떨까요?

- 코드에서 비동기식(콜백 포함)을 표현하는 방법은 동기식 두뇌 계획 동작에 전혀 매핑되지 않는 것으로 나타났습니다.

만약, 계획한다면 다음과 같을 것입니다.

> "가게에 가야 하는데 가는 길에 전화가 올 것 같아서 '안녕, 엄마'라고 하고 그녀가 말을 시작하는 동안 GPS로 가게 주소를 찾아보고, 하지만 로드하는 데 몇 초가 걸릴 것이므로 엄마가 더 잘 들을 수 있도록 라디오를 끌 것입니다. 그러면 재킷을 입는 것을 잊었고 밖이 춥다는 것을 알게 될 것입니다. 하지만 상관없이 계속 운전하고 이야기하십시오. 엄마에게 말을 하고 안전벨트를 맟추라고 해서 '예, 엄마, 저는 항상 안전벨트를 매고 있어요!'라고 했습니다. 아, 드디어 GPS가 길을 알려줬습니다. 이제..."

위 방식이 순서 결정 공식 같이 보이겠지만, 우리 두뇌가 함수 수준에서 작동하는 방식입니다.

> 멀티 태스킹이 아닌 빠른 컨텍스트 전환이라는 것을 기억하세요!

개발자로서 비동기 이벤트 코드 작성이 어려운 이유는 도구가 콜백 뿐이라면 의식의 흐름과 사고 및 계획이 우리에게 부자연스럽기 때문입니다.

- 우리는 단계별로 생각하지만, 콜백은 그렇게 표현되지 않기 때문입니다.

<br/>

### Nested/Chained Callbacks

---

```js
listen("click", function handler(evt) {
  setTimeout(function request() {
    ajax("http://some.url.1", function response(text) {
      if (text == "hello") {
        handler();
      } else if (text == "world") {
        request();
      }
    });
  }, 500);
});
```

위 세 가지 함수 체인은 각각 비동기 시리즈의 단계를 의미합니다.

- 이러한 경우를 종종 **콜백 지옥**이라고 합니다.

그러나 실제로 콜백 지옥은 중첩/들여쓰기와 거의 관련이 없고 더 깊은 문제에 해당합니다.

언뜻 보기엔 비동기식을 다음과 같이 순차적으로 매핑하는 것과 같이 보일 수 있습니다.

```js
listen( "..", function handler(..){
  // ..
} );
```

```js
 setTimeout( function request(..){
  // ..
}, 500) ;

```

```js
ajax( "..", function response(..) {
  // ..
} );
```

```js
if ( .. ) {
  // ..
}
else ..
```

하지만 이렇게 선형적으로 추론하는데엔 몇 가지 문제가 있습니다.

우선, 우리가 단계의 후속 라인에 있다는 것은 예제의 우연이며, 실제론 더 많은 요소가 상호 작용합니다.

```js
doA(function () {
  doB();
  doC(function () {
    doD();
  });
  doE();
});
doF();
```

위 작업은 다음과 같은 순서로 작동합니다.

- `doA()`
- `doF()`
- `doB()`
- `doC()`
- `doE()`
- `doD()`

코드를 처음 봤을 대 이를 정확히 이해했나요?

알파벳 순서가 있기에 함수 명명에 불만을 두는 몇몇 사람이 있을 것 같아 알파벳 순으로 작성해보겠습니다.

```js
doA(function () {
  doC();
  doD(function () {
    doF();
  });
  doE();
});
doB();
```

> 자, 알파벳 순으로 작성했습니다. 자연스러운가요?

그렇지 않을 것이라고 확신합니다.

- 더 큰 혼란을 야기하는 것은 **일부가 동기식일 때**입니다.

중첩이 문제의 일부가 될 수 있지만, 중첩만이 이유는 아닙니다.

중첩 없이 코드를 작성해보겠습니다.

```js
listen("click", handler);

function handler() {
  setTimeout(request, 500);
}

function request() {
  ajax("http://some.url.1", response);
}

function response(text) {
  if (text == "hello") {
    handler();
  } else if (text == "world") {
    request();
  }
}
```

위 코드에선 더 이상 중첩/들여쓰기에 문제를 인식할 수 없지만 아직도 콜백 지옥에 취약합니다.

- 해당 코드를 선형적으로 설명하기 위해선 한 함수에서 다른 함수로 건너뛰고 코드 기반 전체를 뛰어 시퀀스 흐름을 확인해야 합니다.
- 그리고 이것은 최상의 케이스 방식으로 단순화되는 코드라는 것을 기억하세요

실제론 더 복잡하며 추론을 어렵게 만든다는 것을 알고 있을 것입니다.

주의해야 할 또 다른 사항은 각 단계를 연속적으로 연결하기 위해선 다음 단계를 향해 하드코딩하는 것 밖에 없습니다.

- 항상 고정된 조건(항상 2에서 3)이라면 하드 코딩이 반드시 나쁜건 아닙니다.
- 하지만 오류 처리 흐름을 표현하지 않기에 코드를 더 취약하게 만들며, 재사용이 불가능하기에 좋지 않습니다.

또한, 두 가지 이상의 콜백 연속 체인이 동시에 발생하거나 게이트 또는 래치가 있는 병렬 콜백으로 분기할 때 어떤 일이 발생하는지 다루지 않는 것도 포함됩니다.

> 머리가 아프네요

이것이 콜백의 첫 번째 결함입니다.

<br/>

## Trust Issues

---

위 문제(순차적 두뇌 계획과 콜백 기반 비동기 간의 불일치)는 문제의 일부일 뿐입니다.

```js
// A
ajax( "..", function(..){
  // C
} );
// B
```

이젠 자바스크립트의 직접 제어 하에 `// A` 와 `// B` 가 작동합니다.

- 하지만 `// C` 는 다른 당사자의 제어 하에 발생하도록 연기되며, 이 경우엔 `ajax()` 함수입니다.

이런 종류의 문제는 프로그램에 많은 문제를 일으키지 않지만, 그렇다고 방심하지 마세요

때때로 `ajax(..)` 가 사용자가 작성했거나 직접 제어하는 함수가 아니라는 생각을 중심으로 전개되는데, 많은 경우 일부 타사에서 제공하는 유틸리티입니다.

프로그램 실행에 대한 제어권을 제 3자에게 넘길 때, 이를 **제어 역전**이라고 합니다.

<br/>

### Tale of Five Callbacks

---

이것이 왜 큰 문제인지 분명하지 않을 것이기에 과장된 시나리오를 구상해보겠습니다.

> 당신이 값비싼 TV를 판매하는 사이트를 위한 전자상거래 체크아웃 시스템을 구축하는 일을 맡은 개발자라고 상상해 보십시오. 당신은 이미 체크아웃 시스템의 모든 다양한 페이지가 잘 구축되어 있습니다. 마지막 페이지에서 사용자가 TV를 구매하기 위해 "확인"을 클릭하면 판매를 추적할 수 있도록 타사 기능(일부 분석 추적 회사에서 제공)을 호출해야 합니다.

그렇게 특정 콜백을 전달할 것이고 그 코드는 다음과 같을 것입니다.

```js
analytics.trackPurchase(purchaseData, function () {
  chargeCreditCard();
  displayThankyouPage();
});
```

그리고 배포가 잘 되어 기뻐하고, 그 코드를 잊은 지 어언 6개월이 지난 뒤에 결제가 5번이 되는 문제가 발생하여 이를 확인합니다.

문제는 콜백을 한 번 대신 다섯 번을 호출하게 된 `analytics` 유틸리티의 문제였고, 테스트 도중에 추가되지 않아야 할 코드가 업데이트 된 것이었습니다.

이러한 문제를 식별하기 위한 논의가 시작되고 다음과 같은 수정이 이루어졌으며 이를 마지못해 동의하게 됩니다.

팀은 만족스러워 보입니다.

```js
var tracked = false;

analytics.trackPurchase(purchaseData, function () {
  if (!tracked) {
    tracked = true;
    chargeCreditCard();
    displayThankyouPage();
  }
});
```

그러다 QA 엔지니어 한 명이 콜백을 호출하지 않는 경우에 대해 제시하게 되고 그런 부분을 생각하지 못한 팀원들은 다음과 같은 대략적인 목록을 구상합니다.

- 콜백을 너무 일찍 호출하십시오(추적되기 전에).
- 콜백을 너무 늦게(또는 전혀) 호출하지 않음
- 콜백을 너무 적게 또는 너무 많이 호출하십시오(예: 발생한 문제처럼!)
- 필요한 환경/매개변수를 콜백에 전달하지 못함
- 발생할 수 있는 모든 오류/예외를 삼키십시오.
- ...

신뢰할 수 없는 유틸리티 때문에 우리는 이러한 논의를 해야 함을 인지합시다.

왜 콜백 지옥이 진짜 지옥인지를 깨닫게 됩니다.

<br/>

## Trying to Save Callbacks

---

앞의 신뢰 문제 중 일부를 해결하기 위한 여러 콜백 디자인 변형이 있습니다.

```js
function success(data) {
  console.log(data);
}

function failure(err) {
  console.error(err);
}

ajax("http://some.url.1", success, failure);
```

위 코드는 오류 처리와 관련한 일부 API 디자인입니다.

- 이 디자인의 API에서는 종종 `failure()` 오류 처리기가 선택 사항이며 제공되지 않으면 오류를 무시한다고 가정합니다.

<div style={{display: "flex", alignItems: "center", flexDirection: "column", border: "1px solid gray", borderRadius: "8px", padding: "20px", marginBottom: '1.5rem'}}>
  <h3>NOTE</h3>
  <span>참고로 위 콜백 디자인은 ES6 Promise API가 사용하는 것입니다.</span>
</div>

또 다른 일반적인 콜백 패턴은 **오류 우선 스타일(`error-first style`)**입니다.

- 성공하면 해당 인수는 비어 있거나 `false` 가 됩니다.
- 그러나 오류 결과가 잡히면 `true` 가 됩니다.

```js
function response(err, data) {
  // error?
  if (err) {
    console.error(err);
  }
  // otherwise, assume success
  else {
    console.log(data);
  }
}
ajax("http://some.url.1", response);
```

위 두 경우 모두 몇 가지 사항을 준수해야 합니다.

1. 보이는 것처럼 대부분의 신뢰 문제를 해결하지 못했습니다.

- 오히려 오류 신호를 모드 받거나 둘 다 받지 않는 상황을 중심으로 코딩해야 하기에 상황이 더 나빠졌습니다.

2. 표준 패턴이지만 재사용성이 거의 없고 더 장황하며 상용구적입니다.

호출되지 않는 신뢰 문제의 경우 어떻습니까?

- 이 부분이 우려된다면 이벤트 취소에 시간 초과를 설정해야 할 것입니다.

우리는 다음과 같은 유틸리티를 만들 수 있을 것입니다.

```js
function timeoutify(fn, delay) {
  var intv = setTimeout(function () {
    intv = null;
    fn(new Error("Timeout!"));
  }, delay);
  return function () {
    // timeout hasn't happened yet?
    if (intv) {
      clearTimeout(intv);
      fn.apply(this, arguments);
    }
  };
}
```

이를 다음과 같이 사용할 수 있습니다.

```js
// using "error-first style" callback design
function foo(err, data) {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
  }
}
ajax("http://some.url.1", timeoutify(foo, 500));
```

또 다른 신뢰 문제는 너무 이르다는 것입니다.

- 이 경우 일부 중요한 작업이 완료되기 전에 호출되는 것을 포함할 수 있습니다.

동기화 또는 비동기 동작에 대한 이러한 비결정성은 대부분 버그를 추적하기 어렵게 만듭니다.

```js
function result(data) {
  console.log(a);
}

var a = 0;

ajax("..pre-cached-url..", result);

a++;
```

이 코드는 `0` 또는 `1` 을 출력하나요?

해당 API가 항상 비동기식으로 실행되는지 여부를 모르는 경우 다음과 같은 유틸리티를 발명할 수 있습니다.

```js
function asyncify(fn) {
  var orig_fn = fn,
    intv = setTimeout(function () {
      intv = null;
      if (fn) fn();
    }, 0);
  fn = null;

  return function () {
    // firing too quickly, before `intv` timer has fired to
    // indicate async turn has passed?
    if (intv) {
      fn = orig_fn.bind.apply(
        orig_fn,
        // add the wrapper's `this` to the `bind(..)`
        // call parameters, as well as currying any
        // passed in parameters
        [this].concat([].slice.call(arguments))
      );
    }
    // already async
    else {
      // invoke original function orig_fn.apply( this, arguments );
    }
  };
}
```

위 함수는 다음과 같이 사용합니다.

```js
function result(data) {
  console.log(a);
}
var a = 0;
ajax("..pre-cached-url..", asyncify(result));
a++;
```
