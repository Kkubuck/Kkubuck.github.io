---
layout: post
title: 'VSCode: General Visual Salient and Camouflaged Object Detection with 2D Prompt Learning'
subtitle: SOD·COD의 여러 modality와 task를 specialist 모델로 따로 만들지 않고, domain 축과 task 축의 2D prompt를 조합해 한 모델에서 학습·zero-shot 전이한 generalist
  dense predictor.
summary: VSCode는 VST 기반 encoder–decoder에 domain prompt와 task prompt를 분리해 넣는다. 네 SOD와 세 COD 작업을 공동 학습하고 보지 못한 조합으로 전이한다.
description: VSCode는 VST 기반 encoder–decoder에 domain prompt와 task prompt를 분리해 넣는다. 네 SOD와 세 COD 작업을 공동 학습하고 보지 못한 조합으로 전이한다.
date: 2026-03-20 09:00:00 +0900
slug: vscode-generalist-cod-cvpr2024
lang: ko
paper: true
categories:
- papers
tags:
- paper
- generalist-model
- prompt-learning
- cod
- sod
- cvpr-2024
venue: CVPR 2024
paper_year: 2024
paper_authors: Ziyang Luo, Nian Liu, Wangbo Zhao, Xuguang Yang, Dingwen Zhang, Deng-Ping Fan, Fahad Khan, Junwei Han
reviewed_on: '2026-07-10'
source_url: https://openaccess.thecvf.com/content/CVPR2024/html/Luo_VSCode_General_Visual_Salient_and_Camouflaged_Object_Detection_with_2D_CVPR_2024_paper.html
pdf_url: https://openaccess.thecvf.com/content/CVPR2024/papers/Luo_VSCode_General_Visual_Salient_and_Camouflaged_Object_Detection_with_2D_CVPR_2024_paper.pdf
code_url: https://github.com/Sssssuperior/VSCode
takeaways:
- 작업별 모델 대신 공유 backbone과 작은 prompt로 여러 SOD·COD 설정을 하나의 좌표계에 배치한다.
- 2D prompt는 modality/domain 지식과 task 지식을 분리해 학습하고, 보지 못한 조합에서도 재결합할 수 있게 한다.
- generalist의 평균 효율과 개별 specialist의 최고 성능, task 간 간섭을 함께 비교해야 한다.
---

## 일곱 작업을 일곱 모델로 풀어야 할까

RGB SOD, RGB-D SOD, video SOD, COD처럼 입력 modality와 목표가 조금씩 달라질 때 보통 별도 specialist를 만든다. 이 방식은 구조와 파라미터가 중복되고, 한 작업에서 배운 단서를 다른 작업에 옮기기 어렵다. VSCode는 네 가지 SOD와 세 가지 COD를 한 모델에서 다루는 **generalist**를 제안한다.

중요한 것은 모든 데이터를 섞어 하나의 모호한 모델을 만드는 것이 아니다. 공유할 지식과 분리할 지식을 prompt의 두 축으로 나눈다.

## 2D prompt의 두 좌표

첫 번째 축은 **domain 또는 modality**다. RGB, depth, thermal, video 등 입력이 제공하는 고유 단서를 표현한다. 두 번째 축은 **task**다. salient object를 찾는지 camouflaged object를 찾는지처럼 같은 입력에서도 목표가 달라지는 부분을 담는다.

encoder–decoder의 여러 위치에 이 2D prompt를 넣어 공유 VST backbone을 조건화한다. 예를 들어 RGB-D COD는 depth domain prompt와 COD task prompt의 조합으로 표현할 수 있다. 학습에서 직접 본 적 없는 조합도 두 축을 재결합해 zero-shot으로 시도할 수 있다는 것이 설계의 매력이다.

## prompt discrimination loss

여러 prompt가 비슷해지면 모델은 조건을 무시하고 평균적인 분할기처럼 행동할 수 있다. VSCode는 prompt discrimination loss로 task와 domain의 고유성을 분리한다. 공유 backbone은 공통 객체성·경계 표현을 배우고, prompt는 각 설정에서 무엇을 강조하거나 억제할지 지정한다.

이 손실은 multi-task learning의 negative transfer를 줄이는 역할도 한다. SOD와 COD는 같은 이진 mask 형식을 가지지만 목표 대비가 반대이므로, 조건 정보가 약하면 한 작업의 쉬운 단서가 다른 작업을 해칠 수 있다.

## 넓은 평가가 핵심

논문은 여섯 작업, 26개 데이터셋에서 모델을 평가하고 보지 못한 task 조합의 zero-shot 결과도 제시한다. generalist 논문은 한 벤치마크의 최고 점수보다 **여러 설정에서 안정적인가, 전체 파라미터와 유지 비용이 줄었는가**를 봐야 한다.

개별 specialist와 비교할 때는 총 모델 수를 고려해야 한다. VSCode 한 개와 task별 일곱 모델의 정확도·메모리·학습 비용을 함께 비교해야 generalist의 실용적 이득이 드러난다. prompt만 바꿔 배포할 수 있다는 운영상의 장점도 수치표 밖에서 중요하다.

## zero-shot 조합이 말해 주는 것

보지 못한 RGB-D COD 같은 조합에서 어느 정도 작동한다면, domain과 task 지식이 실제로 분리되었다는 근거가 된다. 반대로 학습한 데이터셋 스타일을 prompt가 외운 것이라면 새로운 조합에서 무너진다. 따라서 zero-shot 평가는 단순 부가 실험이 아니라 2D factorization 가설의 핵심 검증이다.

이 구조는 더 많은 센서와 dense task를 추가하는 방향으로 확장할 수 있다. 새 작업마다 전체 모델을 다시 만드는 대신 prompt와 일부 adapter만 학습하는 생태계를 상상할 수 있다.

## 한계

두 축만으로 모든 차이를 설명하기 어렵다. 같은 RGB COD라도 동물·의료·산업 장면의 domain gap이 크고, video는 단순 modality라기보다 시간 구조를 요구한다. task 수가 늘면 prompt 간 간섭과 데이터 불균형도 커진다. 실제 비교에서는 한 모델의 편의성뿐 아니라 specialist가 어려운 꼬리 조건에서 여전히 우세한지, prompt 조합이 정말 compositional한지를 확인해야 한다.
