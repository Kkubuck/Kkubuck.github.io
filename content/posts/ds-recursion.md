---
title: 재귀 호출 (Recursive Call)
description: 함수가 자기 자신을 다시 호출하는 재귀의 기본형을 카운트다운, 구구단, 피보나치 수, 진법 변환 예제로 정리했다.
pubDate: 2022-06-21 15:55:12 +0900
category: study
series: data-structures
tags: [data-structure, python, algorithm]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/16
---

## 개념

재귀 호출은 함수 안에서 자기 자신을 다시 호출하는 방식이다. 재귀 함수에는 두 부분이 꼭 필요하다.

- **종료 조건**: 더 이상 호출하지 않고 끝내는 경우. 없으면 호출이 끝없이 이어진다.
- **재귀 단계**: 문제를 조금 줄여서 자기 자신을 다시 호출하는 부분.

## 카운트다운

```python
def countDown(n):
    if n == 0:
        print('발사!!')
    else:
        print(n)
        countDown(n - 1)
```

## 별 찍기

재귀 호출을 출력보다 먼저 하면, 가장 깊은 호출부터 출력되므로 별이 하나씩 늘어난다.

```python
def printStar(n):
    if n > 0:
        printStar(n - 1)
        print('★' * n)
```

## 구구단

```python
def gugu(dan, num):
    print("%d x %d = %d" % (dan, num, dan * num))
    if num < 9:
        gugu(dan, num + 1)
```

## n번째 피보나치 수

```python
def fibo(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibo(n - 1) + fibo(n - 2)
```

이 방식은 같은 값을 여러 번 다시 계산하므로 n이 커지면 급격히 느려진다. 이미 계산한 값을 저장해 두는 방법은 [동적 계획법](/posts/ds-dynamic-programming/) 글에 정리했다.

## 진법 변환

10진수 `n`을 `base`진수로 바꿔 출력한다. `n`을 `base`로 나눈 몫을 먼저 재귀로 출력하고, 마지막에 나머지를 출력하면 높은 자리부터 차례로 찍힌다. `numberChar`는 12진수와 16진수에서 쓰는 문자 목록이다.

```python
numberChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']


def notation(base, n, numberChar):
    if n < base:
        print(numberChar[n], end=' ')
    else:
        notation(base, n // base, numberChar)
        print(numberChar[n % base], end=' ')
```
