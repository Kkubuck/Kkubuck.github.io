---
title: 로지스틱 회귀
description: 선형 방정식의 출력을 시그모이드와 소프트맥스로 확률로 바꾸는 로지스틱 회귀로 이진 분류와 다중 분류를 수행했다.
pubDate: 2022-07-02 15:47:57 +0900
category: study
series: hongong-ml
tags: [machine-learning, scikit-learn, python]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/22
---

## 데이터 준비

1. CSV 파일을 판다스로 읽어 **데이터프레임**으로 만든다.
2. 사용할 열을 **입력 데이터**와 **타깃 데이터**로 나눠 넘파이 배열로 바꾼다.
3. 사이킷런의 `train_test_split()`으로 **훈련 세트**와 **테스트 세트**를 나눈다.
4. `StandardScaler`로 표준화한다. `fit()`은 훈련 세트로만 하고, `transform()`은 훈련 세트와 테스트 세트에 모두 적용한다.

```python
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

train_input, test_input, train_target, test_target = train_test_split(
    fish_input, fish_target, random_state=42)

ss = StandardScaler()
ss.fit(train_input)
train_scaled = ss.transform(train_input)
test_scaled = ss.transform(test_input)
```

타깃에 클래스가 셋 이상 있는 문제를 **다중 분류**라고 한다. 분류 모델이 학습한 클래스 목록은 `classes_` 속성에 들어 있고, `predict_proba()`는 이 순서대로 클래스별 확률을 돌려준다.

k-최근접 이웃도 확률을 출력할 수 있지만, 이웃 중 각 클래스의 비율이라서 이웃이 3개라면 0, 1/3, 2/3, 1처럼 몇 가지 값밖에 나오지 않는다. 확률을 더 자연스럽게 출력하는 모델이 로지스틱 회귀다.

## 로지스틱 회귀

이름은 회귀지만 **분류** 모델이다. 선형 회귀처럼 선형 방정식을 학습한다.

> z = a × (특성 1) + b × (특성 2) + c × (특성 3) + d × (특성 4) + e × (특성 5) + f

a~e는 **가중치(계수)**, f는 **절편**이다. z는 어떤 값이든 될 수 있으므로, 확률로 쓰려면 0~1 사이로 바꿔야 한다. 이때 쓰는 것이 **시그모이드 함수**(로지스틱 함수)다.

![시그모이드 함수 그래프](/assets/img/tistory/22/image-01.png "시그모이드 함수")

z가 아주 큰 음수이면 0에, 아주 큰 양수이면 1에 가까워진다. 시그모이드 출력이 0.5보다 크면 양성 클래스, 0.5 이하이면 음성 클래스로 판단한다.

## 이진 분류

도미와 빙어만 골라 이진 분류를 해 본다. 넘파이 배열은 True/False 리스트로 원하는 원소만 고를 수 있는데, 이를 **불리언 인덱싱**이라고 한다.

```python
from sklearn.linear_model import LogisticRegression

bream_smelt = (train_target == 'Bream') | (train_target == 'Smelt')
train_bream_smelt = train_scaled[bream_smelt]
target_bream_smelt = train_target[bream_smelt]

lr = LogisticRegression()
lr.fit(train_bream_smelt, target_bream_smelt)
lr.predict(train_bream_smelt[:5])
print(lr.coef_, lr.intercept_)  # 학습한 가중치와 절편
```

`decision_function()`은 각 샘플의 z 값을 돌려준다. 이 값을 시그모이드 함수에 넣으면 양성 클래스의 확률이 나온다. 사이파이의 `expit()`이 시그모이드 함수다.

```python
from scipy.special import expit

decisions = lr.decision_function(train_bream_smelt[:5])
expit(decisions)  # predict_proba()의 양성 클래스 확률과 같다
```

## 다중 분류

```python
lr = LogisticRegression(C=20, max_iter=1000)
lr.fit(train_scaled, train_target)
proba = lr.predict_proba(test_scaled[:5])
```

- `max_iter`: 반복 횟수다. 기본값은 100인데, 충분히 학습되지 않았다는 경고가 나오면 늘린다.
- `C`: 규제의 세기다. 로지스틱 회귀는 기본적으로 릿지 회귀처럼 계수의 제곱(L2)을 규제한다. 기본값은 1이고, **작을수록 규제가 강해진다.** 릿지·라쏘의 `alpha`와는 반대 방향이다.

다중 분류는 클래스마다 z 값을 하나씩 계산하고, 가장 큰 z 값을 가진 클래스를 예측한다. 확률은 **소프트맥스 함수**로 구한다. 소프트맥스는 여러 z 값을 지수 함수로 바꾼 뒤 전체 합으로 나눠, 각 값을 0~1 사이로 만들고 합이 1이 되게 한다. 그래서 정규화된 지수 함수라고도 부른다.

![소프트맥스 함수 수식](/assets/img/tistory/22/image-02.png "소프트맥스 함수")

```python
from scipy.special import softmax

decision = lr.decision_function(test_scaled[:5])
softmax(decision, axis=1)  # axis=1: 샘플(행)마다 소프트맥스를 계산한다
```

---

참고: 박해선, 『혼자 공부하는 머신러닝+딥러닝』, 한빛미디어
