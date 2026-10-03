---
title: 큐 (Queue)
description: 먼저 넣은 데이터가 먼저 나오는 큐의 개념과 enQueue·deQueue·peek 구현을 파이썬으로 정리했다.
pubDate: 2022-06-21 15:51:29 +0900
category: study
series: data-structures
tags: [data-structure, python]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/13
---

## 개념

큐는 양쪽이 뚫려 있는 자료구조다. 한쪽에서는 삽입만, 반대쪽에서는 추출만 일어나므로 먼저 넣은 데이터가 먼저 나오는 **선입선출(FIFO)** 구조가 된다.

- 데이터를 넣을 때는 **rear + 1** 위치에 넣는다.
- 데이터를 꺼낼 때는 **front + 1** 위치에서 꺼낸다.
- 비어 있는 큐는 front와 rear가 모두 -1이다.

```python
class Queue:
    def __init__(self, size):
        self.size = size
        self.queue = [None] * size
        self.front = -1
        self.rear = -1
```

## 큐가 가득 찼는지 확인

rear가 마지막 칸에 닿았더라도, 앞에서 데이터를 꺼내 front 앞쪽에 빈칸이 있을 수 있다. 이 경우에는 데이터를 한 칸씩 앞으로 당겨 자리를 만들고 가득 차지 않았다고 판단한다. front가 -1이면 정말로 빈칸이 없는 상태다.

```python
def is_queue_full(self):
    if self.rear != self.size - 1:
        return False
    elif self.rear == self.size - 1 and self.front == -1:
        return True
    else:
        for i in range(self.front + 1, self.size):
            self.queue[i - 1] = self.queue[i]
            self.queue[i] = None
        self.front -= 1
        self.rear -= 1
        return False
```

## 큐가 비었는지 확인

```python
def is_queue_empty(self):
    if self.front == self.rear:
        return True
    else:
        return False
```

## enQueue: 데이터 삽입

```python
def en_queue(self, data):
    if self.is_queue_full():
        return
    self.rear += 1
    self.queue[self.rear] = data
```

## deQueue: 데이터 추출

```python
def de_queue(self):
    if self.is_queue_empty():
        return None
    self.front += 1
    data = self.queue[self.front]
    self.queue[self.front] = None
    return data
```

## peek: 맨 앞 데이터 확인

```python
def peek(self):
    if self.is_queue_empty():
        return None
    return self.queue[self.front + 1]
```

## 실습: 대기 시간 계산

큐의 각 원소가 `(이름, 소요 시간)` 형태일 때, 큐에 남은 작업의 소요 시간을 모두 더한다.

```python
def calc_time(self):
    total = 0
    for i in range(self.front + 1, self.rear + 1):
        total += self.queue[i][1]
    return total
```
