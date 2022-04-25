---
title: Chapter 5. Scope Closure
tags: [closure]
sidebar_position: 5
---

<br/>

## 들어가며 🏃

---

스코프가 작동하는 방식에 대해 자세히 알아봤습니다. 이제 클로저에 대해 알아봅시다.

<br/>

## Enlightenment ❕

---

자바스크립트에서 클로저를 이해하는 것은 열반에 이르는 것처럼 보일 수 있습니다.

- 클로저는 새로운 구문과 패턴을 배워야 하는 새로운 도구가 아닙니다.
- 클로저는 정적 스코프에 의존하는 코드를 작성한 결과로 발생합니다.
  - 그렇기에 클로저 활용을 위해 클로저를 만들 필요가 없습니다.

<br/>

## Nitty Gritty ❕

---

**클로저(Closure)**는 함수가 정적 스코프 밖에서 실행될 때에도 **함수가 정적 스코프를 기억하고 접근할 수 있는 것**을 의미합니다.

```js
function foo() {
  var a = 2;

  function bar() {
    console.log(a); // 2
  }
  bar();
}

foo();
```

함수 `bar()` 는 정적 스코프 조회 규칙(이 경우 RHS)에 따라 바깥쪽 범위의 변수 `a` 에 접근할 수 있습니다.

> 이것이 **클로저인가요?**

- 아마도 그럴 것이지만, 정확하진 않습니다.
- `a` 를 참조하는 `bar()` 를 설명하는 가장 정확한 방법은 정적 스코프 조회 규칙을 사용하는 것이며 이 규칙은 클로저의 일부일 뿐입니다.

학문적인 관점에서 위 코드는 **함수 `bar()` 가 `foo()` 의 스코프에 대해 클로저를 갖고 있다는 것**입니다.

- 다른 말로 `bar()` 가 `foo()` 의 스코프를 닫는다고 말하며, 이는 `bar()` 가 `foo()` 내부에 중첩되기 때문입니다.

클로저는 직접 확인할 수 있는 정적 스코프와 달리 코드 이면에서 일종의 신비한 이동 그림자로 남아있습니다.

```js
function foo() {
  var a = 2;

  function bar() {
    console.log(a);
  }

  return bar;
}

var baz = foo();

baz(); // 2 -- Whoa, closure was just observed, man.
```

함수 `bar()` 는 `foo()` 의 내부 스코프에 대한 정적 스코프 접근 권한을 갖습니다.

- 하지만 **함수 자체인 `bar()` 를 가져와 값으로 전달**합니다.
  - 이 경우 `bar` 가 참조하는 함수 객체 자체를 반환합니다.
  - `foo()` 실행 후 반환 값(함수 `bar()`)을 `baz` 에 전달한 뒤 `baz()` 호출

함수 `bar()` 는 분명히 실행되지만, 이 경우 정적 스코프 밖에서 실행됩니다.

- 원래는 `foo()` 가 실행된 후, 일반적으로 `foo()` 의 내부 스코프 전체가 사라질 것으로 예상됩니다.
  - 이는 가비지 콜렉터가 엔진이 더 이상 사용하지 않는 메모리를 해제한다는 것을 알기 때문입니다.

그러나 클로저는 이를 가능하게 하며 함수 `bar()` 가 이를 사용하고 있다고 판단합니다.

- `bar()` 에는 여전히 `foo()` 내부 스코프에 대한 참조를 가지며 해당 참조를 클로저라고 하는 것입니다.

결국 클로저를 통해 작성자 시점에 정의된 정적 스코프에 계속 접근할 수 있고, 함수가 값으로 전달되고 호출될 수 있는 다양한 방법은 모두 클로저를 확인/실행하는 예시입니다.

```js
function foo() {
  var a = 2;

  function baz() {
    console.log(a); // 2
  }

  bar(baz);
}

function bar(fn) {
  fn(); // look ma, I saw closure!
}
```

내부 함수 `baz` 를 `bar` 로 전달하고 내부 함수(지금은 `fn` 으로 레이블 지정)를 호출합니다.

- 그렇게 할 때, `foo()` 내부 범위에 대한 클로저는 `a` 에 접근하여 확인할 수 있습니다.

```js
var fn;

function foo() {
  var a = 2;

  function baz() {
    console.log(a);
  }

  fn = baz; // assign baz to global variable
}

function bar() {
  fn(); // look ma, I saw closure!
}

foo();

bar(); // 2
```

내부 함수를 정적 스코프 외부로 전달하기 위해선 사용하는 함수가 무엇이든 간에, 원래 선언된 위치에 대한 스코프 참조를 유지하고 우리가 이를 실행할 때마다 클로저가 실행됩니다.

<br/>

## Now I Can See ❕

---

이전 코드 에시는 클로저 사용을 위한 다소 인위적인 예시였습니다.

```js
function wait(message) {
  setTimeout(function timer() {
    console.log(message);
  }, 1000);
}

wait("Hello, closure!");
```

위 코드는 내부 함수(`timer`)를 가져와 `setTimeout(..)` 에 전달합니다.

- 그러나 `timer` 에는 **`wait(..)` 스코프에 대한 클로저**가 있으며 실제로 변수 `message` 에 대한 참조를 유지하고 사용합니다.

`wait(..)` 을 실행한 후 1000 밀리초가 지나면 내부 스코프가 사라진 지 오래된 상태일 것입니다.

- 익명 함수는 여전히 해당 스코프에 대한 클로저를 갖고 있습니다.

엔진 내부 깊숙이 있는 내장 유틸리티인 `setTimeout(..)` 에는 `fn` 또는 `func` 또는 이와 유사한 것으로 불리는 일부 매개변수에 대한 참조가 있습니다.

- 엔진은 내부 타이머 함수를 호출하는 해당 함수를 호출하고 정적 스코프 참조는 여전히 손상되지 않습니다.

```js
function setupBot(name, selector) {
  $(selector).click(function activator() {
    console.log("Activating: " + name);
  });
}

setupBot("Closure Bot 1", "#bot_1");
setupBot("Closure Bot 2", "#bot_2");
```

본질적으로 언제 어디서나 함수(각각의 정적 스코프에 접근하는)를 일급 값으로 취급하고 전달하면 이러한 함수 클로저가 작동하는 것을 볼 수 있습니다.

> 타이머, 이벤트 핸들러, Ajax 요청 또는 기타 비동기(혹은 동기) 작업이 무엇이든 콜백 함수를 전달할 때, 일부 클로저를 사용할 준비를 하세요.

<div style={{display: "flex", alignItems: "center", flexDirection: "column", border: "1px solid gray", borderRadius: "8px", padding: "20px", marginBottom: '1.5rem'}}>
  <h3>NOTE</h3>
  <span>3장에서는 IIFE 패턴을 소개한 바가 있습니다. IIFE가 관찰된 클로저의 예시라고 종종 말하지만, 이런 정의에 필자는 다소 동의하지 않습니다.</span>
</div>

```js
var a = 2;

(function IIFE() {
  console.log(a);
})();
```

해당 코드는 작동하지만 엄밀히 말하면 이는 클로저를 관찰한 것이 아닙니다.

- **IIFE는 정적 스코프 밖에서 실행되지 않기 때문**입니다.
  - 선언된 스코프에서 호출됩니다.

이는 클로저가 아닌 일반적인 정적 스코프 조회를 통해 찾을 수 있습니다.

클로저는 기술적으로 선언 시간에 발생할 수 있지만, 엄격하게 관찰할 수 없습니다.

- IIFE는 그 자체가 관찰된 클로저의 예는 아니지만 절대적으로 스코프를 생성하며 클로저를 생성할 수있는 스코프를 생성하는데 사용하는 가장 일반적인 도구 중 하나입니다.
  - 따라서, IIFE는 자체적으로 클로저를 실행하지는 않지만 실제로 클로저와 밀접한 관련이 있습니다.

<br/>

## Loops and Closure ❕

---

클로저를 설명하는데 사용하는 가장 일반적인 예시는 `for` 루프가 있습니다.

```js
for (var i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
```

<div style={{display: "flex", alignItems: "center", flexDirection: "column", border: "1px solid gray", borderRadius: "8px", padding: "20px", marginBottom: '1.5rem'}}>
  <h3>NOTE</h3>
  <span>린터는 함수를 반복문 안에 넣을 때 종종 불평합니다. 왜냐하면 클로저를 이해하지 못하는 실수가 개발자들 사이에서 너무 흔하기 때문입니다. 클로저의 모든 권한을 활용하여 여기에서 올바르게 수행하는 방법을 설명합니다. 그러나 그 미묘함은 종종 린터에서 잃어버리고 실제로 무엇을 하고 있는지 모른다고 가정하면 관계없이 불평할 것입니다.</span>
</div>

위 코드를 보면, 일반적으로 숫자 `1`, `2` ... `5` 가 초당 하나씩 출력되는 동작을 예상할 수 있습니다.

- 실제로 이 코드를 실행하면 1초 간격으로 5번 `6` 이 출력됩니다.

먼저 `6` 의 출처부터 설명하겠습니다.

- 반복문 종료 조건은 `i` 가 `5` 이하일 때이고, 이에 해당하는 첫 번째 경우는 `i` 가 `6` 일 때 입니다.
  - 따라서 출력은 반복문이 종료된 후 `i` 의 최종 값을 반영합니다.

실제로 타이머가 진행됨에 따라 각 반복에서 `setTimeout(.., 0)` 이더라도 모든 콜백 함수는 루프가 완료된 뒤에 `6` 을 출력합니다.

> 우리가 의도한 대로 동작하게 하기 위해 누락된 부분은 무엇일까요?

누락된 부분은 아마 반복문 각 반복이 `i` 의 복사본을 캡쳐한다는 것을 예상한 것입니다.

- 그러나 스코프 동작 방식에 따라 다섯 가지 함수는 각 반복에서 별도로 정의되지만, 실제론 하나의 `i` 만이 있는 동일한 전역 스코프에서 닫힙니다.
  - 그렇게 모든 함수는 동일한 `i`(`6`)에 대한 참조를 공유합니다.

무엇이 필요할까요? 아마 각 반복에 대한 새로운 스코프 클로저가 필요할 것입니다.

IIFE는 함수를 선언하고 즉시 실행하여 스코프를 생성한다는 사실을 우리는 알고 있습니다.

```js
for (var i = 1; i <= 5; i++) {
  (function () {
    setTimeout(function timer() {
      console.log(i);
    }, i * 1000);
  })();
}
```

이렇게 많은 정적 스코프를 갖게 되었지만, 스코프가 비어있는 경우 스코프 클로저를 갖는 것만으로는 충분하지 않습니다.

- 각 반복에서 `i` 값의 복사본과 함꼐 자체 변수가 필요합니다.

```js
for (var i = 1; i <= 5; i++) {
  (function () {
    var j = i;
    setTimeout(function timer() {
      console.log(j);
    }, j * 1000);
  })();
}
```

잘 동작합니다. 이를 보기 좋게 변형하면 다음과 같이 바꿀 수 있습니다.

```js
for (var i = 1; i <= 5; i++) {
  (function (j) {
    setTimeout(function timer() {
      console.log(j);
    }, j * 1000);
  })(i);
}
```

<br/>

### Block Scoping Revisited ❓

---

이전 솔루션에 대해 자세히 살펴보면 **반복마다 새로운 스코프를 생성**했습니다.

- 실제로 반복 당 스코프가 필요했으며, 3장에선 블록을 하이재킹하고 블록에서 바로 변수를 선언하는 `let` 선언을 배웠습니다.

따라서 다음과 같이 코드를 개선할 수 있습니다.

```js
for (var i = 1; i <= 5; i++) {
  let j = i; // yay, block-scope for closure!
  setTimeout(function timer() {
    console.log(j);
  }, j * 1000);
}
```

이것이 다가 아닙니다. 루프 헤드 내 **`let` 선언은 각 반복마다 선언되는 것을 의미**하기에, 이를 활용하여 다음과 같이 다시 개선할 수 있습니다.

```js
for (let i = 1; i <= 5; i++) {
  setTimeout(function timer() {
    console.log(i);
  }, i * 1000);
}
```

<br/>

## Modules ❕

---

클로저의 힘을 활용하지만 표면적으로 콜백에 나타나지 않는 다른 코드 패턴으로 **모듈 패턴**을 살펴보겠습니다.

```js
function foo() {
  var something = "cool";

  var another = [1, 2, 3];

  function doSomething() {
    console.log(something);
  }

  function doAnother() {
    console.log(another.join(" ! "));
  }
}
```

이 코드는 현재 클로저가 진행되지 않습니다.

- 단순히 `foo()` 의 내부 스코프에 대해 정적 스코프를 갖는 두 가지의 내부 함수 `doSomething()` 및 `doAnother()` 가 있습니다.

```js
function CoolModule() {
  var something = "cool";

  var another = [1, 2, 3];

  function doSomething() {
    console.log(something);
  }

  function doAnother() {
    console.log(another.join(" ! "));
  }

  return {
    doSomething: doSomething,
    doAnother: doAnother,
  };
}

var foo = CoolModule();

foo.doSomething(); // cool
foo.doAnother(); // 1 ! 2 ! 3
```

이것이 모듈 패턴입니다. 가장 일반적인 방법은 *공개 모듈*이라고 하며 여기에서 소개하는 것은 변형입니다.

해당 코드를 좀 더 자세히 살펴보겠습니다.

- `CoolModule()` 은 함수일 뿐이지만 **모듈 인스턴스**를 생성하기 위해 **함수를 호출**해야 합니다.
  - 함수를 실행하지 않으면 내부 스코프와 클로저가 생성되지 않습니다.
- `CoolModule()` 함수는 객체 리터럴 구문(`{ key: value, ... }`)으로 나타나는 객체를 반환합니다.
  - 내부 함수에 대한 참조만이 있으며, 데이터 변수에 대한 참조는 없습니다.

해당 반환 값은 궁극적으로 외부 변수인 `foo` 에 할당되며 `foo.doSomething()` 과 같은 API 프로퍼티 메서드에 접근할 수 있습니다.

<div style={{display: "flex", alignItems: "center", flexDirection: "column", border: "1px solid gray", borderRadius: "8px", padding: "20px", marginBottom: '1.5rem'}}>
  <h3>NOTE</h3>
  <span>모듈에서 실제 객체 리터럴을 반환할 필요는 없고, 내부 함수를 직접 반환할 수 있습니다. <code>jQuery</code> 는 실제로 이에 대한 좋은 예시입니다. <code>jQuery</code> 및 <code>$</code> 식별자는 <code>jQuery</code> 모듈에 대한 공개 API이지만 그 자체로 함수일 뿐입니다.</span>
</div>

`doSomething()` 및 `doAnother()` 함수에는 모듈 인스턴스의 내부 스코프에 대한 클로저가 있습니다.

> 실제로는 `CoolModule()` 을 호출하여 생성되었습니다.

반환하는 객체의 프로퍼티 참조를 통해 정적 스코프 외부에서 해당 함수를 전송할 때, 클로저를 관찰하고 실행할 수 있는(모듈 패턴이 실행되기 위한) 두 가지 조건을 설정했습니다.

- 외부에 닫는 함수가 있어야 하고 최소 한 번은 호출되어야 합니다.
  - 매번 새 모듈 인스턴스 생성
- 둘러싸는 함수는 적어도 하나의 내부 함수를 반환해야 합니다.
  - 그래야 해당 내부 함수가 비공개 스코프에 대한 클로저를 갖고 해당 비공개 상태에 접근 및 수정이 가능합니다.

함수 프로퍼티가 있는 객체는 실제로 모듈이 아닙니다.

- 데이터 프로퍼티만 있고 닫힌 함수가 없는 함수 호출에서 반환된 객체는 관찰 가능한 의미에서 실제로 모듈이 아닙니다.

다음 예시는 하나의 인스턴스, 일종의 싱글톤만 가질 때입니다.

```js
var foo = (function CoolModule() {
  var something = "cool";

  var another = [1, 2, 3];

  function doSomething() {
    console.log(something);
  }

  function doAnother() {
    console.log(another.join(" ! "));
  }

  return {
    doSomething: doSomething,
    doAnother: doAnother,
  };
})();

foo.doSomething(); // cool
```

여기에서 우리는 모듈 함수를 IIFE로 바꾸고, 즉시 이를 호출하며 그 반환 값을 모듈 인스턴스 식별자 `foo` 에 직접 할당했습니다.

또한, 모듈은 함수이기에 인자를 받을 수 있습니다.

```js
function CoolModule(id) {
  function identify() {
    console.log(id);
  }

  return {
    identify: identify,
  };
}

var foo1 = CoolModule("foo 1");
var foo2 = CoolModule("foo 2");

foo1.identify(); // "foo 1"
foo2.identify(); // "foo 2"
```

모듈 패턴의 또 다른 변형은 객체 이름을 공개 API로 정하는 것입니다.

```js
var foo = (function CoolModule(id) {
  function change() {
    // modifying the public API
    publicAPI.identify = identify2;
  }

  function identify1() {
    console.log(id);
  }

  function identify2() {
    console.log(id.toUpperCase());
  }

  var publicAPI = {
    change: change,
    identify: identify1,
  };

  return publicAPI;
})("foo module");

foo.identify(); // foo module
foo.change();
foo.identify(); // FOO MODULE
```

모듈 인스턴스 내부에서 공개 API 객체에 대한 내부 참조를 유지함을 통해, 메서드 및 프로퍼티 추가 및 제거와 해당 값 변경을 포함하여 내부에서 해당 모듈 인스턴스를 수정할 수 있습니다.

<br/>

### Modern Modules ❓

---

다양한 모듈 의존성 로더/관리자는 기본적으로 이 패턴의 모듈 정의를 **친숙한 API**로 마무리합니다.

간단한 증명을 해보겠습니다.

```js
var MyModules = (function Manager() {
  var modules = {};

  function define(name, deps, impl) {
    for (var i = 0; i < deps.length; i++) {
      deps[i] = modules[deps[i]];
    }

    modules[name] = impl.apply(impl, deps);
  }

  function get(name) {
    return modules[name];
  }

  return {
    define: define,
    get: get,
  };
})();
```

이 코드의 핵심은 `modules[name] = impl.apply(impl, deps)` 입니다.

- 이것은 모듈에 대한 정의 래퍼 함수를 호출하고(모든 종속성 전달) 반환 값인 모듈의 API를 이름으로 추적되는 모듈의 내부 목록에 저장합니다.

다음은 일부 모듈을 정의하는데 사용하는 방법입니다.

```js
MyModules.define("bar", [], function () {
  function hello(who) {
    return "Let me introduce: " + who;
  }

  return {
    hello: hello,
  };
});

MyModules.define("foo", ["bar"], function (bar) {
  var hungry = "hippo";

  function awesome() {
    console.log(bar.hello(hungry).toUpperCase());
  }

  return {
    awesome: awesome,
  };
});

var bar = MyModules.get("bar");
var foo = MyModules.get("foo");

console.log(bar.hello("hippo")); // Let me introduce: hippo

foo.awesome(); // LET ME INTRODUCE: HIPPO
```

`"foo"` 및 `"bar"` 모듈은 모든 공개 API를 반환하는 함수로 정의됩니다.

- `"foo"` 는 의존성 매개변수로 `"bar"` 의 인스턴스를 수신하고 그에 따라 사용할 수 있습니다.

클로저의 힘을 완전히 이해하기 위해선 해당 코드를 검토하는데 시간을 투자하세요.

<br/>

### Future Modules ❓

---

ES6는 모듈 개념에 대한 최고 수준의 구문 지원을 추가합니다.

- 모듈 시스템을 통해 로드될 때, ES6는 **파일을 별도의 모듈로 취급**합니다.

각 모듈은 다른 모듈이나 특정 API 멤버를 가져올 수 있을 뿐만 아니라 자체 공개 API 멤버를 내보낼 수 있습니다.

<div style={{display: "flex", alignItems: "center", flexDirection: "column", border: "1px solid gray", borderRadius: "8px", padding: "20px", marginBottom: '1.5rem'}}>
  <h3>NOTE</h3>
  <span>함수 기반 모듈은 정적으로 인식되는 패턴(컴파일러가 알고 있는)이 아니므로 API 의미 체계는 런타임까지 고려되지 않습니다. 즉, 런타임 중에 실제로 모듈의 API를 수정할 수 있습니다. <br/> <br/> 대조적으로 ES6 모듈 API는 정적(API는 런타임에 변경되지 않음)입니다. 컴파일러는 그것을 알고 있기 때문에, 컴파일 중에 가져온 모듈의 API 멤버에 대한 참조가 실제로 존재하는지 확인할 수 있습니다. API 참조가 존재하지 않으면 컴파일러는 기존의 동적 런타임 확인을 기다리지 않고 컴파일 시간에 초기 오류를 발생시킵니다.</span>
</div>

ES6 모듈에는 인라인 형식이 없으므로 별도의 파일(모듈당 하나씩)에 정의해야 합니다.

```js
// bar.js

function hello(who) {
  return "Let me introduce: " + who;
}

export hello;
```

```js
// foo.js

// import only `hello()` from the "bar" module
import hello from "bar";

var hungry = "hippo";

function awesome() {
  console.log(
      hello( hungry ).toUpperCase()
  );
}

export awesome;
```

```js
// baz.js

// import the entire "foo" and "bar" modules
module foo from "foo";
module bar from "bar";

console.log(
  bar.hello( "rhino" )
); // Let me introduce: rhino

foo.awesome(); // LET ME INTRODUCE: HIPPO
```

<div style={{display: "flex", alignItems: "center", flexDirection: "column", border: "1px solid gray", borderRadius: "8px", padding: "20px", marginBottom: '1.5rem'}}>
  <h3>NOTE</h3>
  <span><code>foo.js</code> 및 <code>bar.js</code> 파일을 별도로 생성해야 하며, 콘텐츠는 각각 처음 두 스니펫에 표시된 것과 같습니다. 그런 다음, 세 번째 스니펫에 표시된 대로 프로그램 <code>baz.js</code> 는 해당 모듈을 로드/가져오기 하여 사용합니다.</span>
</div>

`import` 는 모듈의 API에서 현재 스코프로 하나 이상의 멤버를 가져오고, `module` 은 전체 모듈 API를 바인딩된 변수(이 경우 `foo`, `bar`)로 가져옵니다.

또한, `export` 는 식별자(변수 및 함수)를 현재 모듈의 공개 API로 내보냅니다. 이러한 연산자는 모듈의 정의에서 필요한 만큼 사용할 수 있습니다.

모듈 파일 내부 내용은 앞에서 본 함수 클로저 모듈과 마찬가지로 스코프 클로저에 포함된 것처럼 처리됩니다.

<br/>

## Review ❕

---

- 클로저는 함수가 정적 스코프 외부에서 호출된 경우에도 정적 스코프를 기억하고 접근할 수 있는 경우입니다.
- 클로저는 루프와 같이 클로저와 작동 방식을 인지하는데 주의를 기울이지 않으면 실수할 수 있습니다.
- 모듈에는 두 가지 주요 특성이 필요합니다.
  - 둘러싸는 스코프를 만들기 위해 **호출되는 외부 래핑 함수**
  - 래핑 함수의 반환 값에는 래퍼의 **내부 스코프에 대한 클로저가 있는 하나 이상의 내부 함수 참조**
