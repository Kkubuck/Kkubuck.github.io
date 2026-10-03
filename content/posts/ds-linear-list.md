---
title: 선형 리스트 (Linear List)
description: 데이터를 순서대로 나열하는 선형 리스트의 개념과, 파이썬 리스트로 구현한 추가·삽입·삭제 함수를 정리했다.
pubDate: 2022-06-21 15:47:29 +0900
category: study
series: data-structures
tags: [data-structure, python]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/10
---

## 개념

선형 리스트는 데이터를 일정한 순서로 나열한 자료구조로, **순차 리스트**라고도 한다.

- 입력한 순서대로 저장하는 데이터에 알맞다.
- 가장 기본적인 구현 방법은 배열을 이용하는 것이다.
- 데이터가 빈틈없이 붙어 있어야 하므로, 중간에 넣거나 뺄 때 뒤쪽 데이터를 한 칸씩 옮겨야 한다.
- 대표적인 응용 분야로 다항식 표현이 있다.

아래 코드는 모두 전역 리스트 `languages`를 대상으로 한다.

```python
languages = []
```

## 데이터 추가

리스트 끝에 빈칸을 하나 만들고, 그 자리에 데이터를 넣는다.

```python
def add_data(language):
    languages.append(None)
    languages[len(languages) - 1] = language
```

## 데이터 삽입

끝에 빈칸을 만든 뒤, 넣을 위치(`position`)까지 데이터를 한 칸씩 뒤로 민다. 그다음 비워진 자리에 새 데이터를 넣는다.

```python
def insert_data(position, language):
    languages.append(None)
    length = len(languages)
    for i in range(length - 1, position, -1):
        languages[i] = languages[i - 1]
        languages[i - 1] = None
    languages[position] = language
```

## 데이터 삭제

지울 위치를 비우고, 그 뒤의 데이터를 한 칸씩 앞으로 당긴 다음 마지막 칸을 삭제한다.

```python
def delete_data(position):
    length = len(languages)
    languages[position] = None
    for i in range(position + 1, length):
        languages[i - 1] = languages[i]
    del languages[length - 1]
```

```python
add_data('Python')
add_data('C')
insert_data(1, 'Java')
print(languages)  # ['Python', 'Java', 'C']
delete_data(0)
print(languages)  # ['Java', 'C']
```

삽입과 삭제 모두 위치 뒤쪽의 데이터를 옮겨야 하므로, 데이터가 n개일 때 시간 복잡도는 O(n)이다.
