---
title: 그래프 (Graph)
description: 인접 행렬로 표현한 그래프의 출력, 깊이 우선 탐색, 최소 비용 신장 트리, 순회하며 최댓값·최솟값 찾기를 정리했다.
pubDate: 2022-06-21 15:54:17 +0900
category: study
series: data-structures
tags: [data-structure, python, algorithm]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/15
---

## 개념

그래프는 여러 노드가 간선으로 연결된 자료구조다. 트리의 노드에 해당하는 것을 그래프에서는 **정점**(vertex)이라고 부른다.

- 간선에 방향이 있으면 방향 그래프, 없으면 무방향 그래프다.
- 간선에 가중치를 주면 가중치 그래프가 된다.

여기서는 정점 수가 `SIZE`인 인접 행렬 `graph`로 그래프를 표현한다. `graph[i][j]`가 0이 아니면 정점 i와 j가 연결되어 있다.

```python
class Graph:
    def __init__(self, size):
        self.SIZE = size
        self.graph = [[0 for _ in range(size)] for _ in range(size)]
```

## 그래프 출력

```python
def print_graph(g):
    for row in range(g.SIZE):
        for col in range(g.SIZE):
            print(g.graph[row][col], end='\t')
        print()
    print()
```

## 깊이 우선 탐색

0번 정점에서 출발해 방문하지 않은 이웃이 있으면 스택에 넣고 이동한다. 더 갈 곳이 없으면 스택에서 꺼내 이전 정점으로 돌아간다. 탐색이 끝난 뒤 방문 목록에 `find_vtx`가 있으면 0번 정점과 연결되어 있는 것이다.

```python
def find_vertex(g, find_vtx):
    stack = []
    visitedAry = []
    current = 0
    stack.append(current)
    visitedAry.append(current)

    while len(stack) > 0:
        next = None
        for vertex in range(g.SIZE):
            if g.graph[current][vertex] != 0:
                if vertex not in visitedAry:
                    next = vertex
                    break

        if next != None:
            current = next
            stack.append(current)
            visitedAry.append(current)
        else:
            current = stack.pop()

    if find_vtx in visitedAry:
        return True
    else:
        return False
```

## 최소 비용 신장 트리

모든 정점을 최소 비용으로 잇는 트리를 만든다. 간선을 가중치 내림차순으로 정렬한 뒤, 비싼 간선부터 하나씩 지워 본다. 지워도 그래프가 여전히 연결되어 있으면 그대로 지우고, 끊어지면 되돌린다. 간선 수가 `정점 수 - 1`이 되면 멈춘다.

무방향 그래프는 같은 간선이 `(i, j)`와 `(j, i)`로 두 번 들어가므로 정렬 후 하나씩 건너뛰며 중복을 없앤다. 최대 비용 신장 트리를 만들고 싶다면 오름차순으로 정렬하면 된다.

```python
from operator import itemgetter


def minimum_spanning_tree(g):
    edgeAry = []
    for row in range(g.SIZE):
        for col in range(g.SIZE):
            if g.graph[row][col] != 0:
                edgeAry.append([g.graph[row][col], row, col])

    edgeAry = sorted(edgeAry, key=itemgetter(0), reverse=True)

    newAry = []
    for i in range(0, len(edgeAry), 2):
        newAry.append(edgeAry[i])

    index = 0
    while g.SIZE - 1 < len(newAry):
        weight = newAry[index][0]
        start = newAry[index][1]
        end = newAry[index][2]

        g.graph[start][end] = 0
        g.graph[end][start] = 0

        start_found = find_vertex(g, start)
        end_found = find_vertex(g, end)

        if start_found and end_found:
            del newAry[index]
        else:
            g.graph[start][end] = weight
            g.graph[end][start] = weight
            index += 1
```

## 실습: 순회하며 최댓값·최솟값 찾기

각 정점이 가게이고 `storeAry[i]`가 `(가게 이름, 판매량)`일 때, 깊이 우선 탐색으로 모든 가게를 돌며 판매량이 가장 많은 곳과 적은 곳을 찾는다. 위의 `find_vertex`에 `# 추가` 표시한 줄만 더하면 된다.

```python
def find_max_count(g, storeAry):
    stack = []
    visitedAry = []
    current = 0
    stack.append(current)
    visitedAry.append(current)

    maxStore = current                  # 추가
    minStore = current                  # 추가
    maxCount = storeAry[current][1]     # 추가
    minCount = storeAry[current][1]     # 추가

    while len(stack) != 0:
        next = None
        for vertex in range(g.SIZE):
            if g.graph[current][vertex] == 1:
                if vertex not in visitedAry:
                    next = vertex
                    break
        if next != None:
            current = next
            stack.append(current)
            visitedAry.append(current)

            if storeAry[current][1] > maxCount:   # 추가
                maxCount = storeAry[current][1]
                maxStore = current

            if storeAry[current][1] < minCount:   # 추가
                minCount = storeAry[current][1]
                minStore = current
        else:
            current = stack.pop()

    return storeAry[maxStore], storeAry[minStore]  # 추가
```
