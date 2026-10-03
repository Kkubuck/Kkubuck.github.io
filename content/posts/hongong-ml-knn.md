---
title: '마켓과 머신러닝: k-최근접 이웃으로 생선 분류하기'
description: 도미와 빙어의 길이·무게 데이터로 산점도를 그리고, 사이킷런의 k-최근접 이웃 모델로 두 생선을 분류했다.
pubDate: 2022-06-21 19:19:35 +0900
category: study
series: hongong-ml
tags: [machine-learning, scikit-learn, python]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/21
---

## 문제

도미와 빙어를 구분하는 프로그램을 만든다. 생선을 구분하려면 먼저 생선의 특징을 알아야 하므로, 길이와 무게 데이터를 리스트로 준비한다.

- 여러 종류(**클래스**) 중 하나를 고르는 문제를 **분류**(classification)라고 한다.
- 두 클래스 중 하나를 고르는 문제는 **이진 분류**(binary classification)다.
- 길이와 무게처럼 데이터의 특징을 나타내는 값을 **특성**(feature)이라고 한다.

## 데이터 살펴보기

두 특성을 그래프로 그려 보면 데이터를 이해하기 쉽고, 다음 작업에 대한 힌트도 얻을 수 있다. 파이썬의 대표적인 과학 계산용 그래프 패키지는 **matplotlib**이다.

- `plt.scatter()`: x, y 값을 점으로 찍어 **산점도**를 그린다.
- `plt.xlabel()`, `plt.ylabel()`: 축 이름을 정한다.
- `plt.show()`: 그래프를 화면에 출력한다.

```python
import matplotlib.pyplot as plt

bream_length = [25.4, 26.3, 26.5, 29.0, 29.0, 29.7, 29.7, 30.0, 30.0, 30.7, 31.0, 31.0,
                31.5, 32.0, 32.0, 32.0, 33.0, 33.0, 33.5, 33.5, 34.0, 34.0, 34.5, 35.0,
                35.0, 35.0, 35.0, 36.0, 36.0, 37.0, 38.5, 38.5, 39.5, 41.0, 41.0]
bream_weight = [242.0, 290.0, 340.0, 363.0, 430.0, 450.0, 500.0, 390.0, 450.0, 500.0, 475.0, 500.0,
                500.0, 340.0, 600.0, 600.0, 700.0, 700.0, 610.0, 650.0, 575.0, 685.0, 620.0, 680.0,
                700.0, 725.0, 720.0, 714.0, 850.0, 1000.0, 920.0, 955.0, 925.0, 975.0, 950.0]

plt.scatter(bream_length, bream_weight)
plt.xlabel('length')
plt.ylabel('weight')
plt.show()
```

![도미 35마리의 길이-무게 산점도](/assets/img/tistory/21/image-01.png "도미의 길이와 무게")

특성 두 개로 그린 **2차원 그래프**다. 길이가 길수록 무게도 늘어나는, 일직선에 가까운 모양이다. 이런 관계를 **선형적**이라고 한다.

빙어 데이터를 추가해 함께 그려 본다.

```python
smelt_length = [9.8, 10.5, 10.6, 11.0, 11.2, 11.3, 11.8, 11.8, 12.0, 12.2, 12.4, 13.0, 14.3, 15.0]
smelt_weight = [6.7, 7.5, 7.0, 9.7, 9.8, 8.7, 10.0, 9.9, 9.8, 12.2, 13.4, 12.2, 19.7, 19.9]

plt.scatter(bream_length, bream_weight)
plt.scatter(smelt_length, smelt_weight)
plt.xlabel('length')
plt.ylabel('weight')
plt.show()
```

![도미와 빙어의 길이-무게 산점도](/assets/img/tistory/21/image-02.png "도미(파란색)와 빙어(주황색)")

## 학습 데이터 만들기

두 생선의 길이와 무게를 합쳐 `[길이, 무게]` 쌍의 2차원 리스트를 만든다.

```python
length = bream_length + smelt_length
weight = bream_weight + smelt_weight

fish_data = [[l, w] for l, w in zip(length, weight)]
```

정답 데이터도 필요하다. 도미를 1, 빙어를 0으로 두면, 도미가 35마리이고 빙어가 14마리이므로 1이 35개, 0이 14개인 리스트가 된다.

```python
fish_target = [1] * 35 + [0] * 14
```

## k-최근접 이웃으로 훈련하기

사이킷런에서 k-최근접 이웃 알고리즘을 구현한 `KNeighborsClassifier`로 모델을 만들고, `fit()`으로 도미를 찾는 기준을 학습시킨다. 이 과정을 **훈련**(training)이라고 한다. 머신러닝 알고리즘을 구현한 프로그램, 또는 알고리즘을 구체화한 표현을 **모델**(model)이라고 부른다.

```python
from sklearn.neighbors import KNeighborsClassifier

kn = KNeighborsClassifier()
kn.fit(fish_data, fish_target)
kn.score(fish_data, fish_target)  # 1.0
kn.predict([[30, 600]])           # array([1]) → 도미
```

`score()`는 0에서 1 사이의 **정확도**를 돌려준다. 모두 맞히면 1이다.

> 정확도 = 맞힌 개수 ÷ 전체 데이터 개수

## k-최근접 이웃 알고리즘

새 데이터가 들어오면 가장 가까운 데이터 k개를 보고, 그중 다수가 속한 클래스를 정답으로 고른다.

- 참고할 이웃의 수는 기본값이 5이고, `KNeighborsClassifier(n_neighbors=10)`처럼 바꿀 수 있다.
- 훈련할 때 데이터를 모두 저장해 두고, 예측할 때마다 모든 데이터와의 거리를 계산한다.
- 그래서 데이터가 아주 많으면 메모리와 계산 시간이 크게 늘어나 쓰기 어렵다.

---

참고: 박해선, 『혼자 공부하는 머신러닝+딥러닝』, 한빛미디어
