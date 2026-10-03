---
title: 정렬 알고리즘 (Sorting Algorithms)
description: 선택·삽입·버블·퀵 정렬의 동작 원리와 파이썬 구현, 시간 복잡도를 한곳에 정리했다.
pubDate: 2022-06-21 15:56:51 +0900
category: study
series: data-structures
tags: [data-structure, python, algorithm]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/17
---

| 정렬 | 아이디어 | 시간 복잡도 |
| --- | --- | --- |
| 선택 정렬 | 남은 데이터 중 가장 작은 값을 골라 앞으로 보낸다 | O(n²) |
| 삽입 정렬 | 앞쪽의 정렬된 구간에서 자기 자리를 찾아 들어간다 | O(n²) |
| 버블 정렬 | 이웃한 두 값을 비교해 큰 값을 뒤로 보낸다 | O(n²) |
| 퀵 정렬 | 기준값보다 작은 그룹과 큰 그룹으로 나눠 재귀로 정렬한다 | 평균 O(n log n), 최악 O(n²) |

## 선택 정렬

여러 데이터 중에서 가장 작은 값을 뽑는 작업을 반복해 정렬한다.

```python
def selectionSort(array):
    n = len(array)
    for i in range(n - 1):
        minIdx = i
        for k in range(i + 1, n):
            if array[minIdx] > array[k]:
                minIdx = k
        array[i], array[minIdx] = array[minIdx], array[i]
    return array
```

- 바깥 반복(`i`): `i`번째 자리에 들어갈 값을 정한다. 일단 `i`를 최솟값 위치로 둔다.
- 안쪽 반복(`k`): `i + 1`부터 끝까지 보면서 더 작은 값이 있으면 최솟값 위치를 `k`로 바꾼다.
- 안쪽 반복이 끝나면 `i`번째 값과 최솟값을 맞바꾼다.

## 삽입 정렬

앞에서부터 정렬된 구간을 하나씩 늘려 가며, 새로 들어온 값을 그 구간 안의 알맞은 자리에 끼워 넣는다.

```python
def insertionSort(array):
    n = len(array)
    for end in range(1, n):
        for cur in range(end, 0, -1):
            if array[cur - 1] > array[cur]:
                array[cur - 1], array[cur] = array[cur], array[cur - 1]
    return array
```

- `end`: 정렬된 구간의 끝이다. 1부터 시작해 한 칸씩 늘린다.
- `cur`: `end`에서 앞으로 내려오며, 앞의 값이 더 크면 두 값을 바꾼다.

## 버블 정렬

첫 번째 값부터 바로 옆의 값과 비교해 큰 값을 뒤로 보낸다. 한 사이클이 끝나면 가장 큰 값이 맨 뒤에 자리 잡으므로, 다음 사이클은 비교 범위를 하나 줄인다.

```python
def bubble_sort(array):
    n = len(array)
    for i, end in enumerate(range(n - 1, 0, -1)):
        is_change = False
        for curr in range(0, end):
            if array[curr] > array[curr + 1]:
                array[curr], array[curr + 1] = array[curr + 1], array[curr]
                is_change = True
        print(i + 1, "번째 사이클:", array)
        if not is_change:
            break
    return array
```

- `end`: 비교할 범위의 끝이다. `n - 1`에서 시작해 사이클마다 하나씩 줄인다.
- `curr`: 0부터 `end`까지 올라가며 `curr`와 `curr + 1`을 비교하고, 앞의 값이 크면 바꾼다.
- 한 사이클 동안 한 번도 바꾸지 않았다면 이미 정렬된 것이므로 반복을 멈춘다. 그래서 거의 정렬된 배열에서는 연산 수가 크게 줄어든다.

## 퀵 정렬

기준값(pivot)을 하나 고른 뒤, 기준보다 작은 값은 왼쪽, 큰 값은 오른쪽으로 모은다. 나뉜 두 그룹을 재귀 호출로 다시 정렬한다.

```python
def q_sort(array, start, end):
    if end <= start:
        return

    low = start
    high = end
    pivot = array[(low + high) // 2]

    while low <= high:
        while array[low] < pivot:
            low += 1
        while array[high] > pivot:
            high -= 1
        if low <= high:
            array[low], array[high] = array[high], array[low]
            low, high = low + 1, high - 1

    mid = low
    q_sort(array, start, mid - 1)
    q_sort(array, mid, end)


def quick_sort(array):
    q_sort(array, 0, len(array) - 1)
```

- 정렬할 구간의 길이가 1 이하이면 더 나눌 것이 없으므로 끝낸다.
- `low`는 pivot보다 작은 값을 지나치며 오른쪽으로, `high`는 pivot보다 큰 값을 지나치며 왼쪽으로 움직인다.
- 둘이 멈춘 위치에서 `low <= high`이면 두 값을 바꾸고 한 칸씩 더 움직인다.
- `low`가 `high`를 넘어서면 그 위치를 경계로 두 구간을 다시 정렬한다.

pivot이 매번 한쪽 끝 값에 가깝게 뽑히면 구간이 고르게 나뉘지 않아 O(n²)까지 느려진다.

## 실습 문제

### 앞뒤 값을 묶어 그룹 만들기

정렬된 리스트에서 맨 뒤와 맨 앞의 이름을 짝지어 묶고, 양 끝을 잘라 내며 반복한다.

```python
def generate_group(array):
    groups = []
    while len(array) != 0:
        groups.append([array[-1][0], array[0][0]])
        array = array[1:-1]
    return groups
```

### 중간값 기준으로 이진 이미지 만들기

픽셀 값을 정렬해 중간값(`mid_value`)을 구한 뒤, 그보다 작거나 같으면 0, 크면 255로 바꾼다. 정렬된 배열의 중앙값은 `array[len(array) // 2]`로 얻는다.

```python
def make_binary_image(array, mid_value):
    h, w = array.shape
    for i in range(h):
        for j in range(w):
            if array[i][j] <= mid_value:
                array[i][j] = 0
            else:
                array[i][j] = 255
    return array
```

### 중복 제거

```python
def remove_duplicate(array):
    new_array = []
    for i in array:
        if i not in new_array:
            new_array.append(i)
    return new_array
```
