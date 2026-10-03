---
title: 검색 알고리즘 (Search Algorithm)
description: 정렬되지 않은 데이터의 순차 검색과 정렬된 데이터의 이진 검색을 비교하고, 이진 검색을 활용한 실습 문제를 풀었다.
pubDate: 2022-06-21 15:57:41 +0900
category: study
series: data-structures
tags: [data-structure, python, algorithm]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/18
---

## 순차 검색과 이진 검색

| | 순차 검색 | 이진 검색 |
| --- | --- | --- |
| 조건 | 정렬되지 않은 데이터에도 쓸 수 있다 | 정렬된 데이터에서만 쓸 수 있다 |
| 방법 | 처음부터 하나씩 비교한다 | 가운데 값과 비교해 절반을 버린다 |
| 시간 복잡도 | O(n) | O(log n) |

이진 검색은 비교할 때마다 남은 데이터가 절반으로 줄어든다. 데이터가 1,024개라면 순차 검색은 최악의 경우 1,024번을 비교하지만, 이진 검색은 10번 정도면 끝난다.

## 이진 검색

`index_array`는 `(책 이름, 위치)`를 책 이름순으로 정렬한 배열이다. 찾는 이름의 위치를 돌려주고, 없으면 -1을 돌려준다.

```python
def book_search(index_array, find_name):
    pos = -1
    start = 0
    end = len(index_array) - 1

    while start <= end:
        mid = (start + end) // 2
        if find_name == index_array[mid][0]:
            return index_array[mid][1]
        elif find_name > index_array[mid][0]:
            start = mid + 1
        else:
            end = mid - 1
    return pos
```

1. 찾지 못했을 때 돌려줄 값 `pos`를 -1로 둔다.
2. `start <= end`인 동안 가운데 위치 `mid`를 구해 비교한다.
3. 같으면 바로 돌려준다.
4. 찾는 값이 더 크면 오른쪽 절반(`start = mid + 1`), 작으면 왼쪽 절반(`end = mid - 1`)만 남긴다.
5. 범위가 사라질 때까지 못 찾으면 -1을 돌려준다.

가운데를 기준으로 구간을 나눈다는 점에서 퀵 정렬의 분할과 비슷하다.

## 실습: 물품별 판매 개수 세기

판매 기록 `sell_array`(정렬된 상태)에서 물품마다 몇 번 팔렸는지 센다. 이진 검색으로 하나를 찾으면 개수를 올리고 그 원소를 지운 뒤, 더 이상 찾지 못할 때까지 반복한다. 원소를 지워도 정렬 상태는 유지되므로 이진 검색을 계속 쓸 수 있다.

```python
def binary_search(array, find_data):
    start, end = 0, len(array) - 1
    while start <= end:
        mid = (start + end) // 2
        if array[mid] == find_data:
            return mid
        elif array[mid] < find_data:
            start = mid + 1
        else:
            end = mid - 1
    return -1


def count_product(sell_array, sell_product):
    """
    sell_array: 판매된 물건 배열 (정렬된 상태)
    sell_product: 판매된 물품 종류 배열
    """
    result = []
    for product in sell_product:
        count = 0
        while True:
            pos = binary_search(sell_array, product)
            if pos == -1:
                break
            count += 1
            del sell_array[pos]
        result.append((product, count))
    return result
```
