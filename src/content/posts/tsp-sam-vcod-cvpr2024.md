---
title: 'Endow SAM with Keen Eyes: Temporal-spatial Prompt Learning for Video Camouflaged Object Detection'
description: TSP-SAM은 motion-driven self-prompt와 long-range consistency를 결합한다. temporal cue를 prompt 생성과 SAM encoder
  adaptation 양쪽에 사용한다.
summary: TSP-SAM은 motion-driven self-prompt와 long-range consistency를 결합한다. temporal cue를 prompt 생성과 SAM encoder
  adaptation 양쪽에 사용한다.
subtitle: 사람이 찍어 주기 어려운 위장 객체의 prompt를 프레임 간 미세 움직임에서 스스로 만들고, 장거리 시간 일관성으로 prompt 편향을 교정해 SAM을 VCOD에 맞춘 TSP-SAM.
pubDate: 2026-03-19 09:00:00 +0900
slug: tsp-sam-vcod-cvpr2024
kind: paper
lang: ko
tags:
- paper
- video-cod
- sam
- prompt-learning
- cvpr-2024
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/CVPR2024/html/Hui_Endow_SAM_with_Keen_Eyes_Temporal-spatial_Prompt_Learning_for_Video_CVPR_2024_paper.html
venue: CVPR 2024
paperYear: 2024
authors: Wenjun Hui, Zhenfeng Zhu, Shuai Zheng, Yao Zhao
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/CVPR2024/papers/Hui_Endow_SAM_with_Keen_Eyes_Temporal-spatial_Prompt_Learning_for_Video_CVPR_2024_paper.pdf
takeaways:
- 사람에게도 보이지 않는 위장 객체에 수동 point·box prompt를 요구하는 모순을 self-prompt로 해결한다.
- 인접 프레임의 motion은 공간 위치를 찾고, long-range consistency는 프레임 단절로 생긴 prompt bias를 줄인다.
- 움직임이 거의 없거나 배경이 크게 흔들리는 영상에서는 self-prompt의 출발점이 약해질 수 있다.
---

## SAM의 prompt가 없는 상황

SAM은 정확한 point나 box가 주어지면 강력하지만, 위장 객체는 사용자가 위치를 알아보기 어렵다. VCOD에서 매 프레임 prompt를 수동으로 찍는 것은 더 비현실적이다. TSP-SAM은 이 모순을 해결하기 위해 prompt 자체를 영상에서 학습한다.

핵심 단서는 시간이다. 한 프레임에서는 배경처럼 보이던 객체도 움직일 때 주변과 다른 대응을 만든다. 이 motion cue로 대략적인 위치 prompt를 만들고, SAM이 가진 일반 분할 지식을 위장 장면에 연결한다.

## motion-driven self-prompt

연속 프레임의 미세 움직임을 분석해 객체의 전체 이동을 포착하고 spatial localization을 만든다. 여기서 목표는 정밀한 optical flow를 복원하는 것이 아니라, SAM에 전달할 **어디를 분할할지에 대한 힌트**를 얻는 것이다.

self-prompt는 사용자 입력을 없애면서도 SAM을 완전히 재학습하지 않게 한다. 범용 mask prior는 유지하고, VCOD에서 부족한 객체 위치 정보만 temporal model이 담당한다. foundation model과 task-specific cue의 역할이 분명하다.

## long-range consistency

인접 프레임만 사용하면 가림, 갑작스러운 자세 변화, 카메라 흔들림 때문에 prompt가 튄다. 논문은 더 긴 시퀀스의 consistency를 고려해 프레임 사이 불연속에서 생기는 prompt bias를 줄인다. 과거와 미래의 안정적인 객체 표현이 현재의 불확실한 위치를 교정한다.

이 temporal 정보는 prompt 생성에만 쓰이지 않고 SAM encoder에도 주입된다. 즉 decoder 앞에서 box 하나를 넣는 수준이 아니라, 영상 문맥이 image representation 자체를 VCOD에 맞게 조정한다.

## 실험의 해석

논문은 두 VCOD benchmark에서 기존 방법과 비교하고 큰 mIoU 개선을 보고한다. 수치를 읽을 때는 pretrained SAM의 규모와 비교 모델의 backbone 차이를 함께 봐야 한다. 더 중요한 절제는 motion self-prompt만 사용했을 때, long-range consistency를 더했을 때, encoder adaptation까지 했을 때의 변화다.

정성 결과에서는 첫 프레임부터 객체를 찾는지, 빠른 움직임과 긴 정지 구간을 견디는지, 여러 객체가 있을 때 prompt가 한 개체에만 붙지 않는지를 확인해야 한다. 평균 IoU는 시간축의 깜박임을 충분히 드러내지 못한다.

## foundation model adaptation의 교훈

TSP-SAM은 범용 모델의 약점을 더 큰 fine-tuning으로 해결하지 않는다. SAM이 모르는 것은 객체의 일반 형태가 아니라 **위장 영상에서 신뢰할 prompt를 만드는 방법**이라고 진단한다. 그래서 task-specific temporal module을 앞단에 두고 foundation model의 능력을 재사용한다.

이 패턴은 다른 전문 분할에도 적용 가능하다. 사용자가 prompt를 주기 어려운 의료 영상이나 원격탐사에서 센서·시간·텍스트 같은 별도 단서로 self-prompt를 만들 수 있다.

## 남는 문제

정지한 위장 객체는 motion cue를 거의 제공하지 않는다. 반대로 물결, 풀, 카메라 이동은 강한 거짓 motion을 만든다. SAM의 큰 모델 크기와 temporal processing 비용도 실시간 배포에 부담이 된다. long-range memory가 장면 전환이나 객체 재등장에서 정체성을 유지하는지, prompt uncertainty를 명시적으로 추정할 수 있는지도 후속 과제다.
