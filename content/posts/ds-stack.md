---
title: 스택 (Stack)
description: 한쪽 끝에서만 넣고 빼는 스택의 개념과 push·pop·peek 구현, 스택 수열 검증 문제 풀이를 정리했다.
pubDate: 2022-06-21 15:50:45 +0900
category: study
series: data-structures
tags: [data-structure, python]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/12
---

## 개념

스택은 통로가 하나뿐인 자료구조다. 나중에 넣은 데이터가 먼저 나오는 **후입선출(LIFO)** 구조라서, 먼저 넣은 데이터는 가장 나중에 꺼낼 수 있다.

- 가장 위에 있는 데이터의 위치를 **top**이라고 한다.
- 데이터를 넣는 동작은 **push**, 꺼내는 동작은 **pop**이다.
- top의 데이터를 꺼내지 않고 확인만 하는 동작은 **peek**이다.

크기가 정해진 리스트로 구현하고, 비어 있을 때 top은 -1로 둔다.

```python
class Stack:
    def __init__(self, size):
        self.size = size
        self.stack = [None] * size
        self.top = -1
```

## 스택이 가득 찼는지 확인

top이 마지막 칸을 가리키면 더 넣을 자리가 없다.

```python
def is_stack_full(self):
    if self.top == self.size - 1:
        return True
    else:
        return False
```

## 스택이 비었는지 확인

```python
def is_stack_empty(self):
    if self.top == -1:
        return True
    else:
        return False
```

## push

```python
def push(self, data):
    if self.is_stack_full():
        return
    self.top += 1
    self.stack[self.top] = data
```

## pop

```python
def pop(self):
    if self.is_stack_empty():
        return None
    data = self.stack[self.top]
    self.stack[self.top] = None
    self.top -= 1
    return data
```

## peek

```python
def peek(self):
    if self.is_stack_empty():
        return None
    return self.stack[self.top]
```

## 실습: push·pop 순서 검증

`pushed` 순서로 넣으면서 중간중간 꺼냈을 때 `popped` 순서가 나올 수 있는지 판단하는 문제다. 하나를 넣을 때마다, top이 다음에 꺼내야 할 값과 같으면 **같지 않을 때까지 계속** 꺼낸다. 모두 넣은 뒤 스택이 비어 있으면 가능한 순서다.

```python
def validate_stack_sequences(self, pushed, popped):
    c = 0
    for data in pushed:
        self.push(data)
        while not self.is_stack_empty() and self.peek() == popped[c]:
            self.pop()
            c += 1
    return self.is_stack_empty()
```

> 처음 올린 코드는 push 한 번에 pop을 한 번만 확인해서, `pushed = [1, 2, 3]`, `popped = [2, 1, 3]`처럼 연달아 꺼내야 하는 경우를 불가능하다고 잘못 판단했다. 꺼낼 수 있는 만큼 반복해서 꺼내도록 고쳤다.
