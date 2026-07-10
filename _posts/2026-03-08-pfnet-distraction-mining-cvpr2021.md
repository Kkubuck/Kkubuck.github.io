---
layout: post
title: Camouflaged Object Segmentation with Distraction Mining
subtitle: 먼저 전역에서 후보를 찾고, 모호한 영역에 다시 초점을 맞추며 배경 방해 요소를 걷어내는 Positioning and Focus Network의 설계와 의미.
summary: PFNet은 포식 과정에서 영감을 얻어 전역 위치 탐색과 국소 식별을 분리한다. Focus Module은 모호한 영역의 distraction을 발견하고 제거하며 거친 예측을 단계적으로 다듬는다.
description: PFNet은 포식 과정에서 영감을 얻어 전역 위치 탐색과 국소 식별을 분리한다. Focus Module은 모호한 영역의 distraction을 발견하고 제거하며 거친 예측을 단계적으로 다듬는다.
date: 2026-03-08 09:00:00 +0900
slug: pfnet-distraction-mining-cvpr2021
lang: ko
paper: true
categories:
- papers
tags:
- paper
- cod
- coarse-to-fine
- distraction-mining
- cvpr-2021
venue: CVPR 2021
paper_year: 2021
paper_authors: Haiyang Mei, Ge-Peng Ji, Ziqi Wei, Xin Yang, Xiaopeng Wei, Deng-Ping Fan
reviewed_on: '2026-07-10'
source_url: https://openaccess.thecvf.com/content/CVPR2021/html/Mei_Camouflaged_Object_Segmentation_With_Distraction_Mining_CVPR_2021_paper.html
pdf_url: https://openaccess.thecvf.com/content/CVPR2021/papers/Mei_Camouflaged_Object_Segmentation_With_Distraction_Mining_CVPR_2021_paper.pdf
takeaways:
- 전역 후보를 잡는 Positioning Module과 모호한 부분을 다듬는 Focus Module을 분리한다.
- Focus 단계는 단순 refinement가 아니라 잘못 끌린 배경 영역을 찾아 제거하는 distraction mining을 수행한다.
- 효율적인 coarse-to-fine 구조지만 첫 위치 예측이 크게 빗나가면 후속 단계가 회복하기 어렵다.
---

## 발견과 식별을 나누다

위장 장면을 볼 때 처음부터 정확한 윤곽을 그리기는 어렵다. 먼저 “어딘가 이상한 부분”을 넓게 찾고, 그 주변을 자세히 보며 객체인지 확인한다. PFNet은 이 과정을 **Positioning과 Focus** 두 단계로 옮긴다. 이름뿐인 생체 모사가 아니라, 전역 탐색과 국소 정제를 서로 다른 계산으로 분담한다.

COD에서 흔한 실패는 두 종류다. 객체를 통째로 놓치거나, 배경의 비슷한 질감을 객체로 끌어오는 것이다. Positioning Module은 첫 번째 실패를 줄이고, Focus Module은 두 번째 실패를 정리한다.

## Positioning Module

Positioning Module은 깊은 특징의 넓은 수용 영역을 이용해 잠재적 객체 위치를 거칠게 예측한다. 여기서는 픽셀 단위의 완벽한 경계보다 장면 전체에서 후보를 놓치지 않는 것이 중요하다. 작은 무늬 하나에 과도하게 반응하지 않고, 객체가 있을 법한 영역을 전역 문맥으로 좁힌다.

이 초기 지도는 다음 단계의 attention처럼 작동한다. 후속 디코더가 모든 위치를 같은 비중으로 처리하지 않고, 후보 주변에 계산을 집중하게 한다. 그래서 고해상도 특징을 무작정 끝까지 유지하는 방식보다 효율적인 coarse-to-fine 경로를 만든다.

## Focus Module과 distraction mining

Focus Module은 거친 예측에서 애매한 부분을 찾아 점진적으로 보정한다. 핵심은 추가 특징을 합치는 것보다 **distraction region을 명시적으로 발견하고 제거하는 전략**이다. 이전 단계가 객체로 잘못 본 배경과 놓친 객체 영역을 서로 다른 오류 신호로 다뤄, 다음 특징 수준에서 예측을 수정한다.

이 방식은 잔차 학습과 비슷한 직관을 가진다. 이미 맞은 쉬운 영역을 반복해서 계산하기보다, 현재 예측과 특징 사이에서 충돌하는 영역에 집중한다. 여러 단계의 Focus Module을 거치며 윤곽이 정리되고 내부의 빈 부분이 채워진다.

## 효율성과 성능

논문은 세 COD 벤치마크에서 당시의 여러 모델과 비교하고, 실시간 처리 속도도 함께 강조한다. PFNet이 남긴 인상은 무거운 전역 관계 모듈 없이도 **좋은 오류 교정 경로를 설계하면 정확도와 속도를 함께 확보할 수 있다**는 점이다. 논문에서 보고한 72 FPS는 해당 실험 환경의 결과이므로 현재 하드웨어의 절대 속도로 받아들이기보다 구조적 효율성의 근거로 읽는 편이 안전하다.

절제 실험에서는 Positioning만 있을 때와 Focus 및 distraction mining을 더했을 때의 차이가 중요하다. 거친 위치 지도만으로는 경계와 배경 오검출이 남고, 오류 영역을 단계적으로 다룰 때 예측이 안정된다.

## 설계에서 배울 점

PFNet은 refinement를 단순한 “더 깊은 디코더”로 만들지 않는다. 각 단계가 이전 예측의 어떤 오류를 고칠지 역할을 부여한다. 이 원칙은 오늘날의 iterative mask decoder나 prompt refinement에도 그대로 적용된다. 반복 횟수보다 각 반복에서 새로 얻는 정보가 무엇인지가 중요하다.

또한 전역 탐색과 세부 복원을 동시에 한 특징에 요구하지 않는다. 넓게 보는 특징과 촘촘히 보는 특징의 역할을 분리하면, 모델의 오류를 분석하기도 쉬워진다.

## 한계

coarse-to-fine 구조는 첫 단계의 recall에 의존한다. Positioning Module이 작은 객체를 완전히 놓치면 Focus Module은 볼 후보 자체가 없어 복구하기 어렵다. distraction의 정의도 현재 예측에 기반하므로 잘못된 초기 confidence가 다음 단계로 전달될 수 있다. 이후 모델을 비교할 때는 초기 오차에 얼마나 강한지, 여러 객체와 극단적으로 작은 객체에서도 후보를 유지하는지를 확인해야 한다.
