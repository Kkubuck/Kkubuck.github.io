---
title: 결정 트리
description: 질문을 이어 가며 데이터를 나누는 결정 트리의 원리와 지니 불순도·정보 이득, 가지치기, 특성 중요도를 정리했다.
pubDate: 2022-07-03 14:29:51 +0900
category: study
series: hongong-ml
tags: [machine-learning, scikit-learn, python]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/25
---

## 데이터 살펴보기

판다스 데이터프레임에는 데이터를 빠르게 훑어볼 수 있는 메서드가 있다.

- `info()`: 열마다 데이터 타입과 누락된 값이 있는지 보여 준다.
- `describe()`: 열마다 평균, 표준편차, 최솟값, 최댓값 같은 간단한 통계를 출력한다.

통계를 보고 특성마다 스케일이 다르면 `StandardScaler`로 표준화한다. 이때도 훈련 세트로 학습한 통계 값으로 훈련 세트와 테스트 세트를 변환한다. `train_test_split()`의 `test_size`는 테스트 세트의 비율로, 기본값은 0.25다. `test_size=0.2`로 지정하면 데이터의 20%를 테스트 세트로 뗀다.

## 결정 트리

결정 트리는 스무고개처럼 질문을 하나씩 던지며 정답을 찾아 간다. 로지스틱 회귀의 계수보다 이유를 설명하기가 훨씬 쉽다.

![날개가 있는지, 날 수 있는지를 차례로 물어 동물을 분류하는 결정 트리 예시](/assets/img/tistory/25/image-01.png "결정 트리는 질문을 이어 가며 데이터를 나눈다")

사이킷런의 `DecisionTreeClassifier`를 다른 모델과 똑같이 `fit()`으로 훈련한다.

```python
from sklearn.tree import DecisionTreeClassifier

dt = DecisionTreeClassifier(random_state=42)
dt.fit(train_input, train_target)
print(dt.score(train_input, train_target), dt.score(test_input, test_target))
```

깊이를 제한하지 않으면 훈련 세트를 모두 맞힐 때까지 트리가 자라므로 훈련 세트에 과대적합된다.

![깊이 제한 없이 끝까지 자란 결정 트리](/assets/img/tistory/25/image-02.png "깊이를 제한하지 않은 결정 트리")

## 트리 그려 보기

맨 위의 노드를 **루트 노드**, 맨 아래 끝에 달린 노드를 **리프 노드**라고 한다. `plot_tree()`로 트리를 그릴 수 있다.

```python
import matplotlib.pyplot as plt
from sklearn.tree import plot_tree

plt.figure(figsize=(10, 7))
plot_tree(dt, max_depth=1, filled=True, feature_names=['alcohol', 'sugar', 'pH'])
plt.show()
```

- `max_depth=1`: 루트 노드 아래로 한 단계만 펼쳐 그린다.
- `filled=True`: 클래스에 따라 노드를 색칠한다. 한 클래스의 비율이 높을수록 색이 진해진다.
- `feature_names`: 노드에 특성 이름을 표시해 어떤 기준으로 나뉘는지 보여 준다.

부모 노드의 기준보다 작거나 같은 샘플은 왼쪽 노드로, 큰 샘플은 오른쪽 노드로 간다. 각 노드의 `value`는 그 노드에 들어온 샘플의 클래스별 개수다.

## 불순도

![각 노드에 gini, samples, value가 표시된 결정 트리](/assets/img/tistory/25/image-03.png "노드마다 지니 불순도와 샘플 수가 표시된다")

노드에 적힌 `gini`는 **지니 불순도**다. `DecisionTreeClassifier`의 `criterion` 매개변수가 노드를 나누는 기준을 정하는데, 기본값이 `'gini'`다.

> 지니 불순도 = 1 − (음성 클래스 비율² + 양성 클래스 비율²)

- 한 노드에 두 클래스가 정확히 반반 섞여 있으면 0.5로 가장 나쁘다.
- 한 클래스만 있으면 0이다. 이런 노드를 **순수 노드**라고 한다.

결정 트리는 부모 노드와 자식 노드의 불순도 차이인 **정보 이득**이 가장 커지도록 노드를 나눈다. 자식 노드를 순수하게 나눌수록 정보 이득이 커진다.

> 정보 이득 = 부모의 불순도 − (왼쪽 노드 샘플 수 ÷ 부모의 샘플 수) × 왼쪽 노드 불순도 − (오른쪽 노드 샘플 수 ÷ 부모의 샘플 수) × 오른쪽 노드 불순도

`criterion='entropy'`로 지정하면 **엔트로피 불순도**를 쓴다. 제곱 대신 밑이 2인 로그를 사용한다.

> 엔트로피 불순도 = −(음성 클래스 비율 × log₂(음성 클래스 비율) + 양성 클래스 비율 × log₂(양성 클래스 비율))

## 가지치기

끝까지 자란 트리는 훈련 세트에는 잘 맞지만 테스트 세트에서는 점수가 떨어진다. 일반화하는 가장 간단한 방법은 트리의 최대 깊이를 정해 덜 자라게 하는 것이다.

```python
dt = DecisionTreeClassifier(max_depth=3, random_state=42)
dt.fit(train_input, train_target)
```

가지치기를 하면 훈련 세트 점수는 낮아지지만 테스트 세트 점수는 거의 그대로여서 과대적합이 줄어든다.

결정 트리는 특성값의 크기를 비교해 나눌 뿐이므로 **표준화 전처리가 필요 없다.** 또 어떤 특성이 분류에 가장 크게 기여했는지 **특성 중요도**를 계산해 준다.

```python
print(dt.feature_importances_)
```

---

참고: 박해선, 『혼자 공부하는 머신러닝+딥러닝』, 한빛미디어
