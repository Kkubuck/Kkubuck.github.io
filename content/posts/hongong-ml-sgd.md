---
title: 확률적 경사 하강법
description: 데이터가 계속 들어올 때 모델을 이어서 학습하는 점진적 학습과 확률적 경사 하강법, 로지스틱 손실 함수, 조기 종료를 정리했다.
pubDate: 2022-07-02 21:24:45 +0900
category: study
series: hongong-ml
tags: [machine-learning, scikit-learn, python]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/23
---

## 점진적 학습

훈련 데이터가 한 번에 준비되지 않고 매일 새로 들어온다면, 그때마다 모델을 처음부터 다시 훈련하기는 부담스럽다. 이전에 학습한 모델을 버리지 않고 새 데이터로 조금씩 더 훈련하는 방식을 **점진적 학습**이라고 한다. 대표적인 점진적 학습 알고리즘이 **확률적 경사 하강법**이다.

## 확률적 경사 하강법

경사 하강법은 손실 함수라는 산에서 경사가 가장 가파른 방향을 따라 조금씩 내려가 가장 낮은 지점을 찾는 방법이다. 한 번에 크게 움직이면 최저점을 지나칠 수 있으므로 조금씩 내려가는 것이 중요하다.

경사를 계산할 때 샘플을 몇 개 쓰느냐에 따라 세 가지로 나뉜다.

| 방식 | 한 번에 쓰는 샘플 | 특징 |
| --- | --- | --- |
| 확률적 경사 하강법 | 무작위로 고른 1개 | 빠르지만 경로가 들쭉날쭉하다 |
| 미니배치 경사 하강법 | 무작위로 고른 여러 개 | 실전에서 가장 많이 쓴다 |
| 배치 경사 하강법 | 전체 | 가장 안정적이지만 자원을 많이 쓴다 |

![확률적 경사 하강법과 배치 경사 하강법의 가중치 이동 경로 비교](/assets/img/tistory/23/image-01.png "확률적 경사 하강법(왼쪽)과 배치 경사 하강법(오른쪽)")

훈련 세트를 한 번 모두 사용하는 과정을 **에포크**(epoch)라고 한다. 보통 수십에서 수백 번의 에포크를 반복한다.

## 손실 함수

**손실 함수**는 모델이 얼마나 틀렸는지 재는 기준이다. 값이 작을수록 좋지만, 어떤 값이 최솟값인지는 미리 알 수 없다.

분류에서는 정확도가 가장 직관적인 기준이지만 손실 함수로는 쓸 수 없다. 샘플이 4개라면 정확도는 0, 0.25, 0.5, 0.75, 1 다섯 가지 값만 가질 수 있다. 이렇게 띄엄띄엄한 값은 연속적이지 않아 미분할 수 없고, 경사 하강법으로 조금씩 움직일 수도 없다.

### 로지스틱 손실 함수

이진 분류에서는 예측 확률을 이용한다. 예측 확률에 타깃을 곱하고 음수로 바꾸면, 잘 맞힐수록 값이 작아진다. 타깃이 음성(0)이면 곱이 항상 0이 되므로, 예측 확률을 `1 - 예측`으로 바꾸고 타깃을 1로 바꿔 같은 방식으로 계산한다.

| 타깃 | 예측 확률 | 계산 | 결과 |
| --- | --- | --- | --- |
| 양성(1) | 0.9 | −(0.9 × 1) | −0.9 (잘 맞힘) |
| 양성(1) | 0.3 | −(0.3 × 1) | −0.3 |
| 음성(0) | 0.2 | −((1 − 0.2) × 1) | −0.8 (잘 맞힘) |
| 음성(0) | 0.8 | −((1 − 0.8) × 1) | −0.2 |

여기에 로그를 적용하면 다루기가 더 편하다. 0~1 사이에서 로그는 음수이므로 최종 손실은 양수가 되고, 예측이 정답에서 멀어 확률이 0에 가까울수록 손실이 아주 커져 모델에 큰 영향을 준다.

![로그 함수 그래프. x가 0에 가까워질수록 값이 급격히 작아진다](/assets/img/tistory/23/image-03.png "로그 함수는 0에 가까울수록 아주 큰 음수가 된다")

- 타깃이 양성일 때: −log(예측 확률)
- 타깃이 음성일 때: −log(1 − 예측 확률)

이것을 **로지스틱 손실 함수** 또는 **이진 크로스엔트로피 손실 함수**라고 한다. 다중 분류에서는 **크로스엔트로피 손실 함수**를 쓴다.

회귀에서는 다음 두 가지를 주로 쓴다.

- **평균 절댓값 오차(MAE)**: 타깃과 예측의 차이의 절댓값을 모든 샘플에서 평균한 값
- **평균 제곱 오차(MSE)**: 타깃과 예측의 차이를 제곱해 모든 샘플에서 평균한 값

## SGDClassifier로 분류하기

데이터 준비 과정은 [로지스틱 회귀](/posts/hongong-ml-logistic-regression/)와 같다. 표준화할 때는 반드시 훈련 세트로 학습한 통계 값으로 훈련 세트와 테스트 세트를 모두 변환한다.

```python
from sklearn.preprocessing import StandardScaler

ss = StandardScaler()
ss.fit(train_input)
train_scaled = ss.transform(train_input)
test_scaled = ss.transform(test_input)
```

사이킷런에서 확률적 경사 하강법을 쓰는 분류 모델은 `SGDClassifier`다.

```python
from sklearn.linear_model import SGDClassifier

# loss: 손실 함수 종류 ('log_loss'는 로지스틱 손실, 예전 버전에서는 'log')
# max_iter: 수행할 에포크 횟수
sc = SGDClassifier(loss='log_loss', max_iter=10, random_state=42)
sc.fit(train_scaled, train_target)
print(sc.score(train_scaled, train_target), sc.score(test_scaled, test_target))

# 이어서 1 에포크 더 훈련
sc.partial_fit(train_scaled, train_target)
```

`partial_fit()`은 호출할 때마다 1 에포크씩 이어서 훈련한다. 처음부터 다시 훈련하는 `fit()`과 다른 점이다.

`loss`의 기본값은 `'hinge'`다. 힌지 손실은 서포트 벡터 머신이라는 다른 알고리즘을 위한 손실 함수다.

## 에포크와 과대적합·과소적합

- **과대적합**: 훈련 세트 점수가 테스트 세트보다 지나치게 높다. 에포크를 너무 많이 반복하면 훈련 세트에만 맞춰진다.
- **과소적합**: 훈련 세트 점수가 테스트 세트보다 낮거나 둘 다 낮다. 에포크가 너무 적으면 덜 학습된다.

![에포크에 따른 훈련 세트와 테스트 세트 정확도 변화](/assets/img/tistory/23/image-04.png)

에포크가 진행될수록 훈련 세트 점수는 꾸준히 오르지만, 테스트 세트 점수는 어느 지점을 지나면 오히려 떨어진다. 과대적합이 시작되기 전에 훈련을 멈추는 것을 **조기 종료**(early stopping)라고 한다.

직접 확인하려면 300 에포크 동안 `partial_fit()`을 반복하며 에포크마다 점수를 기록하고, `plt.plot()`으로 그려 본다.

```python
import numpy as np

sc = SGDClassifier(loss='log_loss', random_state=42)
train_score, test_score = [], []
classes = np.unique(train_target)

for _ in range(300):
    sc.partial_fit(train_scaled, train_target, classes=classes)
    train_score.append(sc.score(train_scaled, train_target))
    test_score.append(sc.score(test_scaled, test_target))
```

![300 에포크 동안의 정확도 그래프](/assets/img/tistory/23/image-05.png)

초기에는 과소적합이라 두 점수가 모두 낮고, 100번째 에포크를 지나면서 두 점수의 차이가 점점 벌어진다. 이 데이터에서는 100 에포크가 적절한 반복 횟수다.

```python
sc = SGDClassifier(loss='log_loss', max_iter=100, tol=None, random_state=42)
sc.fit(train_scaled, train_target)
```

`SGDClassifier`는 일정 에포크 동안 성능이 나아지지 않으면 알아서 멈춘다. `tol=None`으로 지정하면 이 기능을 끄고 `max_iter`만큼 끝까지 훈련한다.

---

참고: 박해선, 『혼자 공부하는 머신러닝+딥러닝』, 한빛미디어
