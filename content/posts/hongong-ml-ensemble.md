---
title: 트리의 앙상블
description: 정형 데이터에서 가장 강력한 앙상블 학습을 랜덤 포레스트, 엑스트라 트리, 그레이디언트 부스팅, 히스토그램 기반 부스팅 순서로 정리했다.
pubDate: 2022-07-04 13:12:04 +0900
category: study
series: hongong-ml
tags: [machine-learning, scikit-learn, python]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/27
---

CSV나 엑셀처럼 가지런히 정리된 데이터를 **정형 데이터**, 텍스트·사진·음악처럼 그렇지 않은 데이터를 **비정형 데이터**라고 한다. 정형 데이터에서 가장 뛰어난 성과를 내는 알고리즘이 **앙상블 학습**이다. 대부분 결정 트리를 기반으로 한다.

## 랜덤 포레스트

앙상블 학습의 대표 주자로, 성능이 안정적이다. 결정 트리를 무작위로 여러 개 만들어 숲을 이루고, 각 트리의 예측을 모아 최종 예측을 만든다.

![여러 결정 트리의 결과를 다수결이나 평균으로 모으는 랜덤 포레스트](/assets/img/tistory/27/image-01.png "각 트리의 예측을 다수결(분류)이나 평균(회귀)으로 모은다")

트리마다 훈련 데이터를 무작위로 뽑는데, 이때 같은 샘플이 여러 번 뽑힐 수 있다(중복 허용). 이렇게 만든 샘플을 **부트스트랩 샘플**이라고 하며, 기본적으로 훈련 세트와 같은 크기로 만든다.

![훈련 세트에서 중복을 허용해 여러 부트스트랩 샘플을 뽑는 과정](/assets/img/tistory/27/image-02.png "부트스트랩 샘플링")

노드를 나눌 때도 전체 특성 가운데 일부만 무작위로 골라 그중에서 최선의 분할을 찾는다.

- 분류 모델 `RandomForestClassifier`: 전체 특성 개수의 제곱근만큼 고른다. 특성이 4개라면 노드마다 2개를 쓴다.
- 회귀 모델 `RandomForestRegressor`: 전체 특성을 쓴다.

사이킷런의 랜덤 포레스트는 기본적으로 이렇게 결정 트리 100개를 훈련한다. 샘플과 특성을 무작위로 고르기 때문에 훈련 세트에 과대적합되는 것을 막고, 테스트 세트에서 안정적인 성능을 낸다.

```python
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_validate

rf = RandomForestClassifier(n_jobs=-1, random_state=42)
scores = cross_validate(rf, train_input, train_target, return_train_score=True, n_jobs=-1)
print(np.mean(scores['train_score']), np.mean(scores['test_score']))
```

`return_train_score`의 기본값은 `False`이므로, 훈련 세트 점수도 보려면 `True`로 지정한다.

랜덤 포레스트는 결정 트리의 앙상블이므로 `criterion`, `max_depth`, `max_features`, `min_samples_split`, `min_impurity_decrease`, `min_samples_leaf` 같은 결정 트리의 매개변수를 모두 지원한다.

### OOB 점수

부트스트랩 샘플에 한 번도 뽑히지 않은 샘플을 **OOB(out of bag) 샘플**이라고 한다. 이 샘플로 각 트리를 평가할 수 있으니, 검증 세트 역할을 하는 셈이다. `oob_score=True`로 지정하면 OOB 점수를 계산한다(기본값은 `False`).

```python
rf = RandomForestClassifier(oob_score=True, n_jobs=-1, random_state=42)
rf.fit(train_input, train_target)
print(rf.oob_score_)
```

OOB 점수로 교차 검증을 대신하면 그만큼 더 많은 샘플을 훈련에 쓸 수 있다.

## 엑스트라 트리

랜덤 포레스트와 비슷하게 기본적으로 결정 트리 100개를 훈련하고, 결정 트리의 매개변수도 그대로 지원한다. 다른 점은 두 가지다.

- 부트스트랩 샘플을 쓰지 않고, 트리마다 **전체 훈련 세트**를 사용한다.
- 노드를 나눌 때 가장 좋은 분할을 찾지 않고 **무작위로 분할**한다. 결정 트리에서 `splitter='random'`으로 지정한 것과 같다.

트리 하나만 놓고 보면 무작위 분할 때문에 성능이 떨어지지만, 많은 트리를 앙상블하면 과대적합을 막고 검증 세트 점수를 높이는 효과가 있다. 최선의 분할을 찾지 않으므로 계산이 빠르다.

```python
from sklearn.ensemble import ExtraTreesClassifier

et = ExtraTreesClassifier(n_jobs=-1, random_state=42)
scores = cross_validate(et, train_input, train_target, return_train_score=True, n_jobs=-1)
print(np.mean(scores['train_score']), np.mean(scores['test_score']))
```

회귀 버전은 `ExtraTreesRegressor`다.

## 그레이디언트 부스팅

깊이가 얕은 결정 트리를 하나씩 추가하며, **이전 트리의 오차를 보완**하는 방식으로 앙상블한다. 사이킷런의 `GradientBoostingClassifier`는 기본적으로 깊이가 3인 결정 트리 100개를 사용한다. 트리가 얕기 때문에 과대적합에 강하고 일반화 성능이 높다.

이름처럼 경사 하강법을 사용한다. 분류에서는 로지스틱 손실 함수, 회귀에서는 평균 제곱 오차 함수를 손실로 두고, 트리를 추가할 때마다 손실이 낮아지는 방향으로 조금씩 이동한다. 이동하는 정도는 학습률(`learning_rate`)로 조절한다.

```python
from sklearn.ensemble import GradientBoostingClassifier

gb = GradientBoostingClassifier(random_state=42)
scores = cross_validate(gb, train_input, train_target, return_train_score=True, n_jobs=-1)
print(np.mean(scores['train_score']), np.mean(scores['test_score']))
```

- 학습률을 높이고 트리 개수(`n_estimators`)를 늘리면 성능을 더 끌어올릴 수 있다.
- `subsample`은 트리 하나를 훈련할 때 쓸 훈련 세트의 비율이다. 기본값 1은 전체를, 1보다 작으면 일부를 무작위로 쓴다.

회귀 버전은 `GradientBoostingRegressor`다.

## 히스토그램 기반 그레이디언트 부스팅

정형 데이터를 다루는 머신러닝 알고리즘 가운데 가장 인기가 높다.

1. 입력 특성을 256개 구간으로 나눠 두므로 최적의 분할을 아주 빠르게 찾는다.
2. 256개 구간 중 하나는 누락된 값을 위해 떼어 두므로, 누락된 값을 따로 전처리할 필요가 없다.

사이킷런에서는 `HistGradientBoostingClassifier`로 제공한다. 트리 개수는 `n_estimators` 대신 부스팅 반복 횟수를 뜻하는 `max_iter`로 정한다.

```python
from sklearn.ensemble import HistGradientBoostingClassifier

hgb = HistGradientBoostingClassifier(random_state=42)
scores = cross_validate(hgb, train_input, train_target, return_train_score=True)
print(np.mean(scores['train_score']), np.mean(scores['test_score']))
```

사이킷런 1.0 이전에는 `from sklearn.experimental import enable_hist_gradient_boosting`을 먼저 실행해야 했다.

### 특성 중요도

히스토그램 기반 그레이디언트 부스팅의 특성 중요도는 `permutation_importance()`로 계산한다. 특성을 하나씩 무작위로 섞었을 때 모델 성능이 얼마나 떨어지는지 보고, 많이 떨어질수록 중요한 특성으로 본다. 훈련 세트와 테스트 세트, 사이킷런의 다른 모델에도 쓸 수 있다.

```python
from sklearn.inspection import permutation_importance

hgb.fit(train_input, train_target)
result = permutation_importance(hgb, train_input, train_target,
                                n_repeats=10, random_state=42, n_jobs=-1)
print(result.importances_mean)
```

`n_repeats`는 섞는 횟수로, 기본값은 5다. 결과에는 특성 중요도(`importances`)와 그 평균(`importances_mean`), 표준편차(`importances_std`)가 들어 있다.

회귀 버전은 `HistGradientBoostingRegressor`다.

### 다른 라이브러리

| 라이브러리 | 클래스 | 비고 |
| --- | --- | --- |
| 사이킷런 | `HistGradientBoostingClassifier` | |
| XGBoost | `XGBClassifier` | `tree_method='hist'`로 지정하면 히스토그램 기반 |
| LightGBM | `LGBMClassifier` | 히스토그램 기반 |

---

참고: 박해선, 『혼자 공부하는 머신러닝+딥러닝』, 한빛미디어
