---
title: 'Segment, Magnify and Reiterate: Detecting Camouflaged Objects the Hard Way'
description: SegMaR은 Segment–Magnify–Reiterate의 반복 구조를 사용한다. discriminative mask와 attention sampler로 작은 객체와 저해상도
  경계를 선택적으로 확대한다.
summary: SegMaR은 Segment–Magnify–Reiterate의 반복 구조를 사용한다. discriminative mask와 attention sampler로 작은 객체와 저해상도 경계를
  선택적으로 확대한다.
subtitle: 작고 흐릿한 객체를 한 번에 분할하려 하지 않고, 판별 영역을 찾고 확대해 다시 분할하는 과정을 반복하는 다단계 COD 프레임워크.
pubDate: 2026-03-11 09:00:00 +0900
slug: segmar-cvpr2022
kind: paper
lang: ko
tags:
- paper
- cod
- iterative-refinement
- small-objects
- cvpr-2022
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/CVPR2022/html/Jia_Segment_Magnify_and_Reiterate_Detecting_Camouflaged_Objects_the_Hard_Way_CVPR_2022_paper.html
venue: CVPR 2022
paperYear: 2022
authors: Qi Jia, Shuilian Yao, Yu Liu, Xin Fan, Risheng Liu, Zhongxuan Luo
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/CVPR2022/papers/Jia_Segment_Magnify_and_Reiterate_Detecting_Camouflaged_Objects_the_Hard_Way_CVPR_2022_paper.pdf
takeaways:
- 큰 객체와 작은 객체에 같은 단일 단계 계산을 적용하는 문제를 지적한다.
- discriminative mask로 fixation과 edge를 고르고, attention sampler가 해당 영역을 점진적으로 확대한다.
- 반복 정제는 작은 객체에 강하지만 첫 마스크의 누락과 단계별 계산 비용에 민감하다.
---

## 작은 객체에는 더 많은 관찰이 필요하다

한 장을 같은 해상도로 한 번 통과시키는 모델은 큰 객체와 작은 객체에 같은 계산량을 쓴다. 하지만 작은 위장 객체는 몇 픽셀의 윤곽만 남아 있고, 다운샘플링을 거치면 그 단서가 먼저 사라진다. SegMaR은 이 불균형을 정면으로 다룬다. 어려운 영역을 찾아 확대하고, 다시 분할하는 과정을 반복한다.

이름 그대로 흐름은 **Segment → Magnify → Reiterate**다. 사람도 작은 이상 징후를 발견하면 그 부분을 가까이 보듯, 모델이 현재 예측을 바탕으로 다음 관찰 영역을 선택한다.

## 첫 단계: discriminative mask

초기 segmentation은 완성된 정답이라기보다 다음 계산을 위한 지도다. 저자들은 fixation 영역과 edge 영역에 주의를 모으는 discriminative mask를 설계한다. 객체 내부의 가장 눈에 띄는 부분은 위치를 잡고, 경계는 객체 범위를 확장하는 단서를 준다.

일반적인 confidence map만 사용하면 이미 쉬운 내부에 attention이 몰릴 수 있다. fixation과 edge를 함께 강조하면 작은 객체의 중심을 유지하면서도 저해상도에서 끊긴 윤곽을 다음 단계로 전달할 수 있다.

## 두 번째 단계: 선택적으로 확대하기

attention-based sampler는 discriminative mask가 가리킨 객체 영역을 점진적으로 magnify한다. 전체 입력 이미지를 무작정 큰 해상도로 키우지 않고, 필요한 부분의 특징을 더 촘촘하게 샘플링한다. 계산량을 통제하면서 작은 객체에 더 많은 표현 용량을 배분하는 방식이다.

확대된 영역은 다시 segmentation 네트워크를 통과하고, 새 예측으로 관심 영역을 갱신한다. 이 반복을 통해 첫 단계에서 흐릿했던 경계가 더 많은 픽셀을 확보하고, 작은 객체가 배경 특징에 묻히는 문제를 줄인다.

## 실험이 강조하는 것

논문은 전체 벤치마크 성능뿐 아니라 small-object subset에서의 개선을 강조한다. 이는 방법의 주장과 평가가 잘 맞는 부분이다. 모든 샘플의 평균 점수만 보면 큰 객체에서 얻은 이득이 작은 객체 실패를 가릴 수 있기 때문에, 객체 크기별 분석이 필수다.

절제 실험에서는 discriminative mask, attention sampler, 반복 횟수의 영향을 나눠 본다. 확대 자체보다 **어떤 영역을 확대할지 고르는 신호**가 중요하며, 반복을 무한히 늘린다고 계속 좋아지는 것은 아니다. 정제 단계가 늘수록 이전 오류를 확대할 가능성과 계산 비용도 함께 커진다.

## 현재 모델에도 남는 아이디어

SegMaR은 adaptive computation의 한 형태다. 모든 픽셀을 동일하게 처리하지 않고, 현재 모델이 어렵다고 판단한 위치에 추가 계산을 쓴다. 최근의 high-resolution crop, token pruning, region prompt, cascade decoder를 이해할 때 같은 관점이 유용하다.

또 하나의 장점은 원본 이미지 전체를 확대하지 않는다는 점이다. 실제 고해상도 원격탐사나 의료 영상에서도 관심 영역만 재샘플링하는 전략은 메모리와 세부 보존 사이의 현실적인 절충안이 된다.

## 실패 가능성

첫 segment 단계가 객체를 완전히 놓치면 sampler가 확대할 위치를 얻지 못한다. 잘못된 배경을 선택하면 그 오류가 다음 단계에서 더 선명해질 수도 있다. 여러 개의 작은 객체가 넓게 흩어진 장면에서는 제한된 crop budget을 어떻게 배분할지도 문제다. 따라서 후속 설계는 탐색 다양성을 유지하고, 확대하지 않은 전역 문맥을 계속 보존하며, 반복 종료 기준을 학습할 필요가 있다.
