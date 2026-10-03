---
title: '프로그래머스: 성격 유형 검사하기 (2022 KAKAO TECH INTERNSHIP)'
description: 질문별 선택지에 따라 성격 유형 점수를 더하고, 지표마다 점수가 높은 유형을 고르는 구현 문제.
pubDate: 2022-09-06 13:26:58 +0900
category: coding-test
tags: [programmers, python]
origin:
  name: Tistory
  url: https://jms3084.tistory.com/35
---

[문제 보기](https://school.programmers.co.kr/learn/courses/30/lessons/118666)

## 문제 요약

성격 유형은 네 가지 지표로 나뉘고, 지표마다 두 유형 중 하나가 결정된다.

| 지표 | 유형 |
| --- | --- |
| 1번 | 라이언형(R), 튜브형(T) |
| 2번 | 콘형(C), 프로도형(F) |
| 3번 | 제이지형(J), 무지형(M) |
| 4번 | 어피치형(A), 네오형(N) |

질문마다 `survey[i]`가 주어진다. 예를 들어 `"AN"`이면 비동의 쪽을 고를 때 A, 동의 쪽을 고를 때 N이 점수를 얻는다. 선택지 `choices[i]`는 1(매우 비동의)부터 7(매우 동의)까지이고, 4(모르겠음)에서 멀수록 1점, 2점, 3점을 얻는다.

모든 점수를 더한 뒤 지표마다 점수가 높은 유형을 고른다. 점수가 같으면 사전 순으로 빠른 유형을 고른다. 결과를 지표 순서대로 이어 붙여 반환한다.

## 풀이

- 선택지가 4보다 크면 동의 쪽 유형(`survey[i]`의 두 번째 문자)에 `choice - 4`점을 더한다.
- 4 이하이면 비동의 쪽 유형(첫 번째 문자)에 `4 - choice`점을 더한다. 4이면 0점이다.
- 지표마다 `RT`, `CF`, `JM`, `AN`의 두 유형을 비교한다. 각 쌍은 이미 사전 순이므로, 점수가 같을 때 앞 글자를 고르면 된다.

```python
def solution(survey, choices):
    score = {}
    for (a, b), choice in zip(survey, choices):
        score.setdefault(a, 0)
        score.setdefault(b, 0)
        if choice > 4:
            score[b] += choice - 4
        else:
            score[a] += 4 - choice

    answer = ''
    for first, second in ['RT', 'CF', 'JM', 'AN']:
        if score.get(first, 0) >= score.get(second, 0):
            answer += first
        else:
            answer += second
    return answer
```

```python
solution(["AN", "CF", "MJ", "RT", "NA"], [5, 3, 2, 7, 5])  # "TCMA"
solution(["TR", "RT", "TR"], [7, 1, 3])                    # "RCJA"
```
