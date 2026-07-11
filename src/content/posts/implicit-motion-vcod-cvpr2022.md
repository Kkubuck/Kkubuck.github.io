---
title: Implicit Motion Handling for Video Camouflaged Object Detection
description: 인접 프레임의 dense correlation volume으로 단기 움직임을 포착하고 spatio-temporal transformer로 장기 일관성을 보강한다. MoCA-Mask
  데이터셋도 함께 제안한다.
summary: 인접 프레임의 dense correlation volume으로 단기 움직임을 포착하고 spatio-temporal transformer로 장기 일관성을 보강한다. MoCA-Mask 데이터셋도
  함께 제안한다.
subtitle: 광류를 먼저 계산해 전달하지 않고 인접 프레임의 dense correlation에서 움직임을 암묵적으로 학습하며, 장기 일관성까지 하나의 분할 목표로 최적화한 VCOD 프레임워크.
pubDate: 2026-03-10 09:00:00 +0900
slug: implicit-motion-vcod-cvpr2022
kind: paper
lang: ko
tags:
- paper
- video-cod
- motion
- temporal-consistency
- cvpr-2022
categories:
- papers
sourceUrl: https://openaccess.thecvf.com/content/CVPR2022/html/Cheng_Implicit_Motion_Handling_for_Video_Camouflaged_Object_Detection_CVPR_2022_paper.html
venue: CVPR 2022
paperYear: 2022
authors: Xuelian Cheng, Huan Xiong, Deng-Ping Fan, Yiran Zhong, Mehrtash Harandi, Tom Drummond, Zongyuan Ge
reviewedOn: '2026-07-10'
pdfUrl: https://openaccess.thecvf.com/content/CVPR2022/papers/Cheng_Implicit_Motion_Handling_for_Video_Camouflaged_Object_Detection_CVPR_2022_paper.pdf
codeUrl: https://xueliancheng.github.io/SLT-Net-project
takeaways:
- 광류나 homography를 별도 전처리하지 않고 특징 간 dense correlation으로 움직임을 학습한다.
- 인접 프레임의 단기 동역학과 전체 구간의 장기 일관성을 서로 다른 모듈로 다룬다.
- 움직이지 않는 객체·카메라 변화·긴 가림에서는 motion cue가 약하거나 오해를 낳을 수 있다.
---

## 정지 영상에서 안 보이면 움직임을 본다

위장 객체는 한 프레임 안에서 배경과 거의 같다. 하지만 객체나 카메라가 움직이면 시간축에서 불일치가 생긴다. Video COD의 핵심은 이 움직임을 얼마나 안정적으로 포착하느냐다. 기존 접근은 optical flow나 homography를 먼저 계산해 분할 네트워크에 넣는 경우가 많았는데, motion estimation이 틀리면 그 오류가 segmentation까지 누적된다.

이 논문은 두 문제를 분리하지 않는다. **움직임 표현과 객체 분할을 하나의 목표로 공동 최적화**해, 최종 마스크에 실제로 필요한 motion cue가 무엇인지 직접 배우게 한다.

## dense correlation으로 얻는 암묵적 움직임

인접 프레임의 특징 사이에 dense correlation volume을 만든다. 한 위치의 특징이 다음 프레임의 어느 위치와 닮았는지 모두 비교하므로, 명시적인 flow vector를 만들지 않아도 이동 관계를 표현할 수 있다. 이 correlation은 짧은 시간 간격에서 객체가 배경과 다르게 움직이는 흔적을 드러낸다.

중요한 점은 별도의 motion ground truth로 감독하지 않는다는 것이다. 최종 segmentation loss가 correlation representation까지 역전파되어, 일반적인 광류 정확도보다 VCOD에 유용한 대응 관계를 학습한다. 그래서 저자들은 이를 implicit motion handling이라고 부른다.

## 짧은 움직임과 긴 일관성

인접 프레임만 보면 순간적인 노이즈나 가림에 민감하다. 논문은 spatio-temporal transformer를 더해 더 긴 구간의 특징을 함께 보고 단기 예측을 다듬는다. 한 프레임에서 경계가 사라져도 앞뒤 프레임에서 유지된 객체 단서를 참조할 수 있고, 배경의 우연한 움직임은 시퀀스 전체의 일관성으로 걸러낼 수 있다.

즉 dense correlation은 **무엇이 움직였는지**를 가까운 프레임에서 찾고, transformer는 **그 후보가 시간 동안 같은 객체로 유지되는지**를 확인한다. 두 시간 규모를 분리한 설계가 논문의 중심이다.

## MoCA-Mask의 의미

저자들은 픽셀 수준 마스크를 갖춘 대규모 VCOD 데이터셋 MoCA-Mask와 비교 벤치마크를 함께 제공한다. 비디오 분할 연구에서는 프레임별 주석 비용이 커서 데이터가 병목이 되기 쉽다. 데이터셋 기여는 구조 제안만큼 중요하며, 이후 방법들이 같은 조건에서 시간 일관성을 비교할 기반을 만들었다.

실험에서는 기존 VCOD 방법과 이미지 기반 COD 모델을 비교하고, correlation과 temporal transformer를 제거했을 때의 변화를 본다. 결과는 단기 motion과 장기 consistency가 서로 대체재가 아니라 보완재라는 해석을 뒷받침한다.

## 이 접근이 깔끔한 이유

전처리 flow에 의존하지 않으면 파이프라인이 end-to-end가 되고 오류의 책임도 명확해진다. correlation 자체는 고전적인 아이디어지만, segmentation supervision 아래에서 학습되므로 과업에 맞는 움직임을 선택한다. 이후 video segmentation의 memory, matching, reference-frame 설계와도 자연스럽게 연결된다.

내가 특히 좋게 본 부분은 시간축을 하나의 거대한 모듈로 처리하지 않고, 근거리 대응과 장거리 안정성으로 나눈 점이다. 오류 원인을 분석하고 각 모듈의 역할을 검증하기 쉽다.

## 어려운 장면은 남는다

객체와 카메라가 모두 멈추면 motion cue가 사라진다. 카메라 흔들림, 물결, 나뭇잎처럼 배경 자체가 움직이는 장면에서는 correlation이 오히려 혼란을 줄 수 있다. 긴 가림이나 장면 전환도 제한된 temporal window의 기억을 끊는다. 따라서 실제 시스템에서는 appearance cue와 motion cue의 신뢰도를 상황에 따라 조절하고, 긴 시퀀스에서 메모리 비용을 관리하는 설계가 필요하다.
