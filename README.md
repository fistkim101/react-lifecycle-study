## 생명주기
탄생을하고 소멸을 한다는 것을 전제로 하여 시간의 흐름을 기준으로 인식하는 멘탈모델. 안드로이드, iOS, flutter 모두 작게는 위젯단위 크게는 앱 running 전체에서 생명주기에 입각하여 설계가 되어 있다.

## 리액트 생명주기 메서드
리액트 생명주기 메서드는 React.Component 를 상속하는 class(= backing instance를 가진 컴포넌트)가 사용할 수 있는 자원이다. 컴포넌트의 생명주기 각 단계별로 메서드가 정의되어 있어서, 이를 오버라이드 해서 원하는 시점에 원하는 로직을 적용시킬 수 있는 유연한 개발이 가능하다.

https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/
- getDerivedStateFromProps, getSnapshotBeforeUpdate 는 실무에서 잘 사용되지 않기 때문에 생략
- componentDidCatch 는 실습에 추가(책에는 있으나 이미지상에 없음)
- defaultProps 는 생명주기 메서드는 아니지만 생명주기에 연관되어있기 때문에 실습에 추가

## 실습
부모 컴포넌트 내에 자식 컴포넌트가 있는 예제를 통해서 각 생명주기 메서드의 call 시점을 관찰해보기

### 생성 될 때

defaultProps 는 렌더링 상관없이 전부 실행된다. '렌더링 상관없이' 라는 의미는 render() 함수를 통해서 리액터DOM 을 이용해서 실제 DOM 에 그리든 안그리든 상관없이 라는 의미이다.(node_modules/react/cjs/react-jsx-dev-runtime.development.js:804 에서 비슷한 로직을 찾긴 하였으나 어디서 실제로 작동하는지 위치는 파악하지 못하였음)
```javascript
function App() {
    return (
        <div className="App">
            <Parent/>
            {/*<Single/>*/}
        </div>
    );
}
```
```bash
*** Child => defaultProps
*** Parent => defaultProps
*** Single => defaultProps  <<<<< 렌더링 대상에 빠져있는데도 defaultProps가 실행되었음을 알 수 있음
*** Parent => constructor
*** Child => constructor || red@@@
*** Child => constructor || red###
*** Child => componentDidMount || red@@@
*** Child => componentDidMount || red###
*** Parent => componentDidMount
```

<br>
<br>

constructor 는 렌더링이 발생하는 컴포넌트에 한해 call 되며 각 컴포넌트들의 생명주기 메서드들보다 우선하여 모든 렌더링 대상 컴포넌트들의 constructor가 먼저 모두 call 된다.
```javascript
function App() {
    return (
        <div className="App">
            <Parent/>
            <Single/>
        </div>
    );
}
```
```bash
*** Child => defaultProps
*** Parent => defaultProps
*** Single => defaultProps
*** Parent => constructor
*** Child => constructor || red@@@
*** Child => constructor || red###
*** Single => constructor   <<<<< Parent 에 대한 렌더링을 시작하지 않고 Single 의 생성자가 먼저 call 되었음
*** Child => componentDidMount || red@@@
*** Child => componentDidMount || red###
*** Parent => componentDidMount
```

<br>
<br>

### 업데이트 할 때

재귀적인 호출을 통해서 자식 컴포넌트의 갱신부터 모두 끝내고 부모가 갱신된다.
```bash
=======================================
*** Child => shouldComponentUpdate
* nextProps : blue@@@
* nextState : green
* nextContext : [object Object]
*** Child => shouldComponentUpdate
* nextProps : blue###
* nextState : green
* nextContext : [object Object]
*** Child => componentDidUpdate || red@@@
*** Child => componentDidUpdate || red###
*** Parent => componentDidUpdate    <<<<< Parent 에서 setState() 호출 했으나 결과적으로 setState를 호출한 컴포넌트가 포함하고 있는 모든 자식 컴포넌트의 렌더링이 다 끝나고 마지막에 해당 컴포넌트의 갱신이 발생함.
```
 
<br>
<br>

갱신 대상의 자식 컴포넌트들은 순차적으로 갱신이 진행되지 않고 모든 컴포넌트의 갱신 여부부터 다 파악한다. 즉, 갱신 대상인 자식 컴포넌트들의 모든 shouldComponentUpdate들 부터 일일이 call 해서 갱신 여부부터 판단하는 것. 이렇게 하는 이유는 성능 최적화를 위해서 render 횟수를 최소화 하기 위해 일괄 갱신을 하고자 미리 갱신 여부를 판단하는 것으로 보인다.

즉, 첫번째 자식이 갱신 대상이며 갱신 여부가 true 를 반환했다 할지라도 첫번째 대상을 렌더링 하지 않고, 다른 갱신 대상의 shouldComponentUpdate() 를 call 해서 갱신 여부를 파악한다. 추측컨데 렌더링 하고 또 해도 되는데 일부러 repaint 횟수를 줄이기 위한(일괄 갱신을 위해) 것으로 보인다.
```bash
=======================================
*** Child => shouldComponentUpdate    <<<<< 갱신 대상인 자식 컴포넌트의 shouldComponentUpdate가 call 되었음
* nextProps : blue@@@
* nextState : green
* nextContext : [object Object]
*** Child => shouldComponentUpdate    <<<<< 갱신 대상인 자식 컴포넌트의 shouldComponentUpdate가 call 되었음
* nextProps : blue###
* nextState : green
* nextContext : [object Object]
*** Child => componentDidUpdate || red@@@
*** Child => componentDidUpdate || red###
*** Parent => componentDidUpdate
```

<br>
<br>

그 외
- React.Component vs React.PureComponent 의 차이는 shouldComponentUpdate 가 무조건 true를 반환하느냐 혹은 props&state의 얕은 비교를 하느냐의 차이이다.
- shouldComponentUpdate 의 nextContext 사용처를 모르겠다.

<br>
<br>

### 제거 할 때 (+ 에러 처리)

에러 발생시 자동으로 해당 컴포넌트와 자식 컴포넌트의 componentWillUnmount가 발생.
```bash
*** Parent => componentWillUnmount
*** Child => componentWillUnmount
```

<br>
<br>

그 외
- componentDidCatch 는 해당 함수가 오버라이드된 컴포넌트에서 발생하는 에러를 캐치하는 것이 아니고 해당 컴포넌트의 자식을 포함하여 그 이하의 컴포넌트의 에러에 대해서 캐칭한다.
- componentDidCatch 가 선언된 컴포넌트의 자식 컴포넌트에서 에러가 발생하면 componentDidCatch 가 선언된 해당 컴포넌트를 포함하여 그 이하 모든 자식 컴포넌트가 unmount 된다(= componentWillUnmount()가 call 된다)
- componentDidCatch 가 선언되지 않고 에러가 나면 그냥 앱 전체 렌더링이 불가능해진다.
- (의논해보기) SmallParent 없이 1:N 에서 N 중 하나만 문제났을때 해결 방법이 있을까? hooks 에서는 어떻게 처리하나?

