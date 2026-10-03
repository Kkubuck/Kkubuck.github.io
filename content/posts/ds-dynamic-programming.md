---
title: 동적 계획법 (Dynamic Programming)
description: 작은 문제의 답을 표에 저장해 다시 쓰는 동적 계획법을 배낭 문제, 미로 최대·최소 경로, 피보나치 수열로 정리했다.
pubDate: 2022-06-21 16:00:00 +0900
category: study
series: data-structures
tags: [data-structure, python, algorithm]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/19
---

## 개념

동적 계획법은 큰 문제를 작은 문제로 나누고, 작은 문제의 답을 표(메모이제이션 배열)에 저장해 두었다가 다시 쓰는 방법이다. 같은 계산을 반복하지 않으므로 [재귀 호출](/posts/ds-recursion/)로 풀 때보다 훨씬 빠르다.

## 배낭 문제

무게 제한이 있는 배낭에 보석을 골라 담을 때, 담을 수 있는 최대 가격을 구한다. `weight`와 `money`는 1번 인덱스부터 보석 정보를 담고 있다.

```python
def knapsack(maxWeight, rowCount, weight, money):
    """
    maxWeight: 배낭 최대 무게
    rowCount: 보석 개수
    weight: 보석 무게 리스트
    money: 보석 가격 리스트
    출력값: 배낭에 담을 수 있는 보석의 최대 가격
    """
    array = [[0 for _ in range(maxWeight + 1)] for _ in range(rowCount + 1)]
    for row in range(1, rowCount + 1):
        for col in range(1, maxWeight + 1):
            if weight[row] > col:
                array[row][col] = array[row - 1][col]
            else:
                value1 = money[row] + array[row - 1][col - weight[row]]
                value2 = array[row - 1][col]
                array[row][col] = max(value1, value2)
    return array[rowCount][maxWeight]
```

- 표의 행은 고려한 보석의 수, 열은 배낭의 무게 한도다. 0행과 0열을 0으로 두기 위해 크기를 하나씩 늘린다.
- `row`번 보석이 배낭 한도 `col`보다 무거우면 넣을 수 없으므로, 바로 위 칸(그 보석 없이 얻은 값)을 그대로 가져온다.
- 넣을 수 있으면 두 경우 중 큰 값을 고른다.
  - 넣는 경우: 이 보석의 가격 + 남은 무게(`col - weight[row]`)로 앞의 보석들에서 얻은 최대 가격
  - 넣지 않는 경우: 바로 위 칸의 값
- 마지막 칸 `array[rowCount][maxWeight]`가 답이다.

```python
knapsack(7, 4, [0, 6, 4, 3, 5], [0, 13, 8, 6, 12])  # 14
```

## 황금 미로: 최대 경로

미로의 왼쪽 위에서 출발해 오른쪽이나 아래로만 움직여 오른쪽 아래에 도착할 때, 모을 수 있는 황금의 최대 개수를 구한다.

```python
def growRich(ROW, COL, goldMaze):
    array = [[0 for _ in range(COL)] for _ in range(ROW)]
    array[0][0] = goldMaze[0][0]

    rowSum = array[0][0]
    for i in range(1, COL):
        rowSum += goldMaze[0][i]
        array[0][i] = rowSum

    colSum = array[0][0]
    for i in range(1, ROW):
        colSum += goldMaze[i][0]
        array[i][0] = colSum

    for i in range(1, ROW):
        for j in range(1, COL):
            if array[i][j - 1] > array[i - 1][j]:
                array[i][j] = array[i][j - 1] + goldMaze[i][j]
            else:
                array[i][j] = array[i - 1][j] + goldMaze[i][j]

    return array[ROW - 1][COL - 1]
```

1. 첫 행과 첫 열은 가는 길이 하나뿐이므로 누적합을 채운다.
2. 나머지 칸은 위 칸과 왼쪽 칸 중 큰 값에 현재 칸의 황금을 더한다.
3. 오른쪽 아래 칸이 답이다.

## 압정 미로: 최소 경로

같은 규칙으로 움직일 때 밟는 압정 수를 최소로 만든다. 황금 미로와 구조가 같고, 위 칸과 왼쪽 칸 중 **작은** 값을 고른다는 점만 다르다.

```python
def reducePushpin(ROW, COL, pushpinMatrix):
    array = [[0 for _ in range(COL)] for _ in range(ROW)]
    array[0][0] = pushpinMatrix[0][0]

    rowSum = array[0][0]
    for i in range(1, COL):
        rowSum += pushpinMatrix[0][i]
        array[0][i] = rowSum

    colSum = array[0][0]
    for i in range(1, ROW):
        colSum += pushpinMatrix[i][0]
        array[i][0] = colSum

    for i in range(1, ROW):
        for j in range(1, COL):
            if array[i - 1][j] < array[i][j - 1]:  # 황금 미로와 다른 부분
                array[i][j] = array[i - 1][j] + pushpinMatrix[i][j]
            else:
                array[i][j] = array[i][j - 1] + pushpinMatrix[i][j]

    return array[ROW - 1][COL - 1]
```

> 처음 올린 코드는 첫 열의 누적합을 0번째 칸부터 다시 더해서 시작 칸의 압정이 두 번 세어졌다. 최소 경로가 첫 열을 따라 내려가는 미로에서는 답이 시작 칸의 압정 수만큼 커졌기 때문에, 황금 미로와 같은 방식으로 고쳤다.

## 피보나치 수열

이미 구한 값을 `memo`에 쌓아 두고 다음 값을 계산한다. 재귀로 풀면 같은 값을 여러 번 계산하지만, 이 방법은 각 값을 한 번씩만 계산한다.

```python
def dp_fibo(n):
    memo = [1, 1]
    if n < 2:
        return memo[n]
    for i in range(2, n + 1):
        memo.append(memo[i - 1] + memo[i - 2])
    return memo[n]
```

- 첫 번째와 두 번째 값은 1이므로 `n < 2`이면 바로 돌려준다.
- 2부터 `n`까지 앞의 두 값을 더해 `memo`에 추가하고, `n`번째 값을 돌려준다.
