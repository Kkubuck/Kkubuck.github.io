---
title: 이진 트리 (Binary Tree)
description: 이진 탐색 트리의 생성과 검색, 전위·중위·후위 순회, 좌우 반전 같은 기본 연산을 파이썬으로 구현했다.
pubDate: 2022-06-21 15:53:19 +0900
category: study
series: data-structures
tags: [data-structure, python]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/14
---

## 개념

이진 트리는 모든 노드가 자식을 최대 두 개(left, right)까지 가지는 트리다. 그중 **이진 탐색 트리**는 다음 규칙을 따른다.

- 연결 리스트의 head 노드에 해당하는 첫 노드를 **root**라고 한다.
- 어떤 노드보다 작은 값은 왼쪽 서브 트리에, 큰 값은 오른쪽 서브 트리에 둔다.
- 왼쪽·오른쪽 서브 트리도 같은 규칙으로 구성된다.
- 모든 노드의 값은 중복되지 않는다.

```python
class TreeNode:
    def __init__(self):
        self.left = None
        self.data = None
        self.right = None
```

## 리스트로 이진 탐색 트리 만들기

`bookAry`의 각 원소는 `[책 이름, 저자]` 형태이고, 책 이름을 기준으로 트리를 만든다. 이미 있는 이름이 나오면 넣지 않고 건너뛴다.

```python
def generate_book_tree(bookAry):
    node = TreeNode()
    node.data = bookAry[0][0]
    root = node

    for book in bookAry[1:]:
        node = TreeNode()
        node.data = book[0]
        current = root
        while True:
            if current.data > book[0]:
                if current.left == None:
                    current.left = node
                    break
                current = current.left
            elif current.data < book[0]:
                if current.right == None:
                    current.right = node
                    break
                current = current.right
            else:
                break  # 중복된 이름은 넣지 않는다

    return root
```

## 데이터 검색

찾는 값이 현재 노드보다 작으면 왼쪽, 크면 오른쪽으로 내려간다. 내려갈 곳이 없으면 트리에 없는 값이다.

```python
def find_node(root, findName):
    current = root

    while True:
        if current.data == findName:
            result = findName + '을(를) 찾음.'
            break
        elif current.data > findName:
            if current.left == None:
                result = findName + '이(가) 트리에 없음'
                break
            current = current.left
        else:
            if current.right == None:
                result = findName + '이(가) 트리에 없음'
                break
            current = current.right
    return result
```

## 순회

노드를 언제 방문하느냐에 따라 세 가지로 나뉜다. 이진 탐색 트리를 중위 순회하면 값이 오름차순으로 출력된다.

| 순회 | 순서 |
| --- | --- |
| 전위 순회 (preorder) | 현재 노드 → 왼쪽 → 오른쪽 |
| 중위 순회 (inorder) | 왼쪽 → 현재 노드 → 오른쪽 |
| 후위 순회 (postorder) | 왼쪽 → 오른쪽 → 현재 노드 |

```python
def preorder(node):
    if node == None:
        return
    print(node.data, end=' ')
    preorder(node.left)
    preorder(node.right)


def inorder(node):
    if node == None:
        return
    inorder(node.left)
    print(node.data, end=' ')
    inorder(node.right)


def postorder(node):
    if node == None:
        return
    postorder(node.left)
    postorder(node.right)
    print(node.data, end=' ')
```

## 실습: 좌우 반전

모든 노드의 left와 right를 바꾼 뒤 root를 돌려준다.

```python
def invertTree(root):
    if root == None:
        return

    root.right, root.left = root.left, root.right

    invertTree(root.left)
    invertTree(root.right)

    return root
```

## 실습: 큰 값부터 모으기

중위 순회를 오른쪽부터 하면 큰 값에서 작은 값 순서로 방문한다.

```python
def traverse_node(root, result):
    if root == None:
        return
    traverse_node(root.right, result)
    result.append(root.data)
    traverse_node(root.left, result)

    return result
```
