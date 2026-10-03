---
title: 교차 검증과 그리드 서치
description: 테스트 세트를 아껴 두기 위한 검증 세트와 k-겹 교차 검증, 하이퍼파라미터를 찾는 그리드 서치와 랜덤 서치를 정리했다.
pubDate: 2022-07-03 19:22:37 +0900
category: study
series: hongong-ml
tags: [machine-learning, scikit-learn, python]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/26
---

## 검증 세트

테스트 세트로 모델을 계속 평가하며 고치다 보면, 결국 모델이 테스트 세트에 맞춰진다. 테스트 세트는 마지막에 한 번만 쓰고, 과대적합·과소적합 여부는 훈련 세트를 한 번 더 나눈 **검증 세트**로 판단한다.

![전체 데이터를 훈련 세트 60%, 검증 세트 20%, 테스트 세트 20%로 나눈 그림](/assets/img/tistory/26/image-01.png "훈련 세트를 다시 나눠 검증 세트를 만든다")

```python
from sklearn.model_selection import train_test_split

# 전체 데이터를 훈련 세트와 테스트 세트로 나눈다
train_input, test_input, train_target, test_target = train_test_split(
    data, target, test_size=0.2, random_state=42)

# 훈련 세트를 다시 훈련 세트(sub)와 검증 세트(val)로 나눈다
sub_input, val_input, sub_target, val_target = train_test_split(
    train_input, train_target, test_size=0.2, random_state=42)
```

`sub_input`, `sub_target`으로 모델을 훈련하고, 테스트 세트 대신 `val_input`, `val_target`으로 평가한다.

## 교차 검증

검증 세트를 조금만 떼어 두면 검증 점수가 들쭉날쭉하고, 많이 떼면 훈련에 쓸 데이터가 줄어든다. **교차 검증**은 검증 세트를 떼어 평가하는 과정을 여러 번 반복하고 점수를 평균내, 안정적인 점수를 얻으면서도 더 많은 데이터를 훈련에 쓰게 해 준다.

![데이터를 네 부분으로 나눠 한 부분씩 돌아가며 검증하는 4-폴드 교차 검증](/assets/img/tistory/26/image-02.png "4-폴드 교차 검증: 네 번 모두 다른 부분으로 검증한다")

훈련 세트를 k개로 나눠 교차 검증하는 것을 **k-폴드(k-겹) 교차 검증**이라고 한다. 보통 5-폴드나 10-폴드를 쓰며, 이 경우 데이터의 80~90%를 훈련에 쓸 수 있다.

```python
from sklearn.model_selection import cross_validate

scores = cross_validate(dt, train_input, train_target)
```

`cross_validate()`는 첫 번째 인자로 평가할 모델, 두 번째와 세 번째로 훈련 세트를 받는다. `fit_time`(훈련 시간), `score_time`(검증 시간), `test_score`(검증 점수) 키를 가진 딕셔너리를 돌려주며, `test_score`의 평균이 교차 검증 점수다.

### 분할기

`cross_validate()`는 폴드를 나눌 때 훈련 세트를 섞지 않는다. 앞에서 `train_test_split()`으로 이미 섞었다면 상관없지만, 교차 검증에서 다시 섞고 싶다면 **분할기**(splitter)를 지정한다. 분할기는 폴드를 어떻게 나눌지 정한다.

- 기본값: 분류 모델은 `StratifiedKFold`, 회귀 모델은 `KFold`
- `n_splits`: 폴드 수
- `shuffle=True`: 훈련 세트를 섞는다

```python
from sklearn.model_selection import StratifiedKFold

splitter = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
scores = cross_validate(dt, train_input, train_target, cv=splitter)
```

## 하이퍼파라미터 튜닝

모델이 학습으로 얻는 값은 **모델 파라미터**, 사람이 미리 정해 줘야 하는 값은 **하이퍼파라미터**라고 한다. 라이브러리에서는 클래스나 메서드의 매개변수로 나타난다.

튜닝은 보통 다음 순서로 한다.

1. 라이브러리의 기본값으로 모델을 훈련한다.
2. 검증 세트나 교차 검증으로 점수를 보며 매개변수를 조금씩 바꾼다.
3. 매개변수가 여러 개라면 **동시에** 바꿔 가며 찾는다. 하나를 고정한 채 다른 하나만 찾으면 최적의 조합을 놓친다.

매개변수가 많아질수록 조합이 복잡해지므로 사이킷런의 그리드 서치를 쓴다.

## 그리드 서치

`GridSearchCV`는 하이퍼파라미터 탐색과 교차 검증을 한 번에 수행한다. `cross_validate()`를 따로 부를 필요가 없다.

```python
from sklearn.model_selection import GridSearchCV
from sklearn.tree import DecisionTreeClassifier

params = {'min_impurity_decrease': [0.0001, 0.0002, 0.0003, 0.0004, 0.0005]}

gs = GridSearchCV(DecisionTreeClassifier(random_state=42), params, n_jobs=-1)
gs.fit(train_input, train_target)
```

- 탐색할 매개변수와 값의 목록을 딕셔너리로 전달한다.
- `cv`의 기본값이 5이므로 값 5개 × 5-폴드 = 25개의 모델을 훈련한다.
- `n_jobs=-1`이면 가능한 모든 CPU 코어를 사용한다.

훈련이 끝나면 검증 점수가 가장 높은 매개변수 조합으로 전체 훈련 세트에서 모델을 다시 훈련해 둔다. 이 모델은 일반 결정 트리처럼 바로 쓸 수 있다.

```python
dt = gs.best_estimator_                       # 최적 매개변수로 다시 훈련한 모델
print(gs.best_params_)                        # 찾은 최적 매개변수
print(gs.cv_results_['mean_test_score'])      # 매개변수마다의 교차 검증 평균 점수
```

더 복잡한 조합도 넣을 수 있다.

```python
import numpy as np

params = {
    'min_impurity_decrease': np.arange(0.0001, 0.001, 0.0001),  # 불순도 감소 최소량: 9개
    'max_depth': range(5, 20, 1),                               # 트리의 깊이: 15개
    'min_samples_split': range(2, 100, 10),                     # 노드를 나누기 위한 최소 샘플 수: 10개
}
```

`range()`는 정수만, `np.arange()`는 실수도 만들 수 있다. 이 조합의 경우의 수는 9 × 15 × 10 = 1,350개이고, 5-폴드 교차 검증을 하므로 6,750개의 모델을 훈련한다.

## 랜덤 서치

매개변수 값이 수치라서 범위나 간격을 미리 정하기 어렵다면 **랜덤 서치**를 쓴다. 값의 목록 대신 값을 샘플링할 수 있는 **확률 분포 객체**를 전달한다.

사이파이의 `uniform`(실수)과 `randint`(정수)는 주어진 범위에서 고르게 값을 뽑는다.

```python
from scipy.stats import uniform, randint

rgen = randint(0, 10)   # 0부터 9까지의 정수
rgen.rvs(10)            # 10개를 샘플링
```

`min_samples_leaf`는 리프 노드가 가져야 할 최소 샘플 수다. 분할했을 때 자식 노드의 샘플이 이 값보다 적어지면 분할하지 않는다.

```python
from sklearn.model_selection import RandomizedSearchCV

params = {
    'min_impurity_decrease': uniform(0.0001, 0.001),
    'max_depth': randint(20, 50),
    'min_samples_split': randint(2, 25),
    'min_samples_leaf': randint(1, 25),
}

# n_iter: 분포에서 매개변수 조합을 몇 번 샘플링할지
gs = RandomizedSearchCV(DecisionTreeClassifier(random_state=42), params,
                        n_iter=100, n_jobs=-1, random_state=42)
gs.fit(train_input, train_target)
```

---

참고: 박해선, 『혼자 공부하는 머신러닝+딥러닝』, 한빛미디어
