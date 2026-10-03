---
title: 연결 리스트 (Linked List)
description: 데이터와 링크로 이루어진 노드를 이어 붙이는 단순 연결 리스트의 출력·삽입·삭제·검색을 파이썬으로 구현했다.
pubDate: 2022-06-21 15:49:32 +0900
category: study
series: data-structures
tags: [data-structure, python]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/11
---

## 개념

연결 리스트는 **노드**를 링크로 이어 만든 자료구조다.

- 노드는 **데이터**와 다음 노드를 가리키는 **링크**로 구성된다.
- 첫 번째 노드를 **head**라고 한다.
- 데이터를 노드 단위로 삽입·삭제한다. 선형 리스트처럼 다른 데이터를 옮길 필요 없이 링크만 바꾸면 된다.

```python
class Node:
    def __init__(self):
        self.data = None
        self.link = None
```

아래 함수들은 전역 변수 `head`, `current`, `pre`를 사용한다.

## 노드 출력

head부터 링크를 따라가며 마지막 노드까지 출력한다.

```python
def printNodes(start):
    current = start
    if current == None:
        return
    print(current.data, end=' ')
    while current.link != None:
        current = current.link
        print(current.data, end=' ')
```

## 노드 삽입

`findData`를 가진 노드 앞에 새 노드를 넣는다. 찾는 노드가 head인 경우, 중간에 있는 경우, 끝까지 없는 경우로 나눈다.

```python
def insertNode(findData, insertData):
    global head, current, pre

    # 첫 번째 노드 앞에 삽입
    if head.data == findData:
        node = Node()
        node.data = insertData
        node.link = head
        head = node
        return

    # 중간 노드 앞에 삽입
    current = head
    while current.link != None:
        pre = current
        current = current.link
        if current.data == findData:
            node = Node()
            node.data = insertData
            node.link = current
            pre.link = node
            return

    # 찾는 노드가 없으면 마지막에 삽입
    node = Node()
    node.data = insertData
    current.link = node
```

## 노드 삭제

첫 번째 노드를 지울 때는 head를 다음 노드로 옮기고, 나머지 노드는 앞 노드의 링크가 삭제할 노드의 다음 노드를 가리키게 한다.

```python
def deleteNode(deleteData):
    global head, current, pre

    # 첫 번째 노드 삭제
    if head.data == deleteData:
        current = head
        head = head.link
        del current
        return

    # 나머지 노드 삭제
    current = head
    while current.link != None:
        pre = current
        current = current.link
        if current.data == deleteData:
            pre.link = current.link
            del current
            return
```

## 노드 검색

찾았는지 여부를 플래그로 기록하면서 끝까지 순회한다. 찾지 못하면 빈 노드를 반환한다.

```python
def findNode(findData):
    global head, current, pre
    current = head
    flag = False

    if head.data == findData:
        result = current
        flag = True

    while current.link != None:
        current = current.link
        if current.data == findData:
            result = current
            flag = True

    if not flag:
        result = Node()

    return result
```
