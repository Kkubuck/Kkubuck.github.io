---
layout: post
title: Rethinking Detecting Salient and Camouflaged Objects in Unconstrained Scenes
subtitle: SOD 장면과 COD 장면이 서로 배타적이라는 기존 데이터셋 가정을 깨고, salient와 camouflaged object가 함께·따로·전혀 없는 모든 경우를 USC12K에서 다루는 USCNet.
summary: USC12K는 두 객체 유형의 네 논리적 존재 시나리오를 주석한다. USCNet은 inter-sample·intra-sample prompt query와 CSCS metric으로 상호 혼동을 모델링·평가한다.
description: USC12K는 두 객체 유형의 네 논리적 존재 시나리오를 주석한다. USCNet은 inter-sample·intra-sample prompt query와 CSCS metric으로 상호 혼동을 모델링·평가한다.
date: 2026-04-03 09:00:00 +0900
slug: uscnet-unconstrained-scenes
lang: ko
paper: true
categories:
- papers
tags:
- paper
- sod
- cod
- unconstrained-scenes
- iccv-2025
venue: ICCV 2025
paper_year: 2025
paper_authors: Zhangjun Zhou, Yiping Li, Chunlin Zhong, Jianuo Huang, Jialun Pei, Hua Li, He Tang
reviewed_on: '2026-07-10'
source_url: https://openaccess.thecvf.com/content/ICCV2025/html/Zhou_Rethinking_Detecting_Salient_and_Camouflaged_Objects_in_Unconstrained_Scenes_ICCV_2025_paper.html
pdf_url: https://openaccess.thecvf.com/content/ICCV2025/papers/Zhou_Rethinking_Detecting_Salient_and_Camouflaged_Objects_in_Unconstrained_Scenes_ICCV_2025_paper.pdf
code_url: https://github.com/ssecv/USCNet
takeaways:
- 기존 SOD/COD dataset이 한 장에 한 유형만 존재한다고 가정해 생기는 task confusion을 문제로 정의한다.
- USC12K는 salient only, camouflaged only, both, neither의 네 scene을 포함하고 두 관계를 동시에 평가한다.
- 새 benchmark의 class·scene 수집 편향과 기존 dataset에서의 transfer를 함께 봐야 실제 unconstrained generalization을 판단할 수 있다.
---

## 현실에는 둘이 함께 있을 수 있다

기존 SOD dataset은 salient object만 foreground로, COD dataset은 camouflaged object만 foreground로 주석하는 경우가 많다. 모델은 한 이미지가 어느 dataset에서 왔는지만 알아도 무엇을 찾을지 추측할 수 있다. 실제 장면에는 눈에 띄는 객체와 숨은 객체가 동시에 있을 수도, 둘 다 없을 수도 있다.

이 배타적 annotation paradigm 때문에 SOD model이 위장 객체를 salient로 오인하고 COD model이 두드러진 객체를 camouflaged로 잡는 현상이 생긴다는 것이 논문의 문제의식이다.

## USC12K의 네 장면

새 dataset **USC12K**는 두 aspect의 논리적 조합을 모두 포함한다. salient object만 있는 장면, camouflaged object만 있는 장면, 둘이 함께 있는 장면, 둘 다 없는 장면이다. 각 유형을 별도로 주석해 모델이 dataset identity가 아니라 실제 visual relation을 배워야 한다.

‘neither’ scene도 중요하다. 기존 binary segmentation model은 항상 무언가 있다고 가정해 false positive를 만들기 쉽다. 빈 예측을 올바른 답으로 인정해야 open-world deployment에서 calibration을 볼 수 있다.

## inter-sample prompt query

USCNet의 첫 prompt mechanism은 서로 다른 샘플 사이의 관계를 모델링한다. 다양한 이미지에서 salient와 camouflaged aspect의 대표 pattern을 모아, 현재 장면이 어느 쪽과 닮았는지 비교한다. dataset-level prototype 또는 learned query로 task boundary를 명시하는 방식이다.

이 경로는 한 이미지에서 단서가 약할 때 다른 샘플의 안정적인 representation을 참고하게 한다. 동시에 두 aspect가 공유하는 objectness와 서로 반대인 contrast 특성을 분리해 학습할 수 있다.

## intra-sample prompt query

두 번째 mechanism은 같은 이미지 안의 salient와 camouflaged 후보 관계를 본다. 서로 배타적으로 처리하지 않고 한 장에서 두 mask가 공존할 수 있게 하며, 한 객체가 양쪽으로 중복 분류되는 confusion을 줄인다.

inter-sample이 class-like prior를 제공한다면 intra-sample은 현재 장면의 상대 contrast와 공간 경쟁을 조정한다. 두 수준을 함께 모델링하는 것이 unconstrained setting의 핵심이다.

## CSCS가 필요한 이유

일반 SOD/COD metric을 각각 계산하면 한 유형의 mask가 다른 유형 영역을 침범한 오류를 충분히 드러내지 못한다. 논문은 두 aspect를 얼마나 잘 구분하는지 평가하기 위한 **CSCS** metric을 제안한다. 정확한 foreground 복원뿐 아니라 salient–camouflaged confusion 자체를 별도 실패로 본다.

새 metric은 모델 주장과 잘 맞지만, 값이 object size나 empty scene 비율에 어떻게 반응하는지 살펴야 한다. 기존 metric과의 상관, 인간이 느끼는 confusion과의 정렬도 중요하다.

## 의미와 한계

이 연구의 가장 큰 기여는 architecture보다 benchmark assumption을 바꾼 데 있다. 모델이 좋은 이유가 아니라 시험 문제가 현실보다 단순했던 것은 아닌지 묻는다. SOD와 COD를 generalist로 묶는 VSCode와도 연결되지만, USCNet은 한 장 안의 공존과 배제 관계를 직접 평가한다.

USC12K 자체의 scene balance, 수집 출처, object category가 새로운 shortcut을 만들 가능성은 남는다. 기존 benchmark에서의 성능을 유지하는지, 전혀 다른 실내·도시 장면에서도 네 시나리오를 구분하는지, empty prediction confidence가 보정되는지를 확인해야 한다.
