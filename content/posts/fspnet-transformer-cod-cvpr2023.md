---
title: 'FSPNet: Feature Shrinkage Pyramid for Camouflaged Object Detection with Transformers'
description: 비전 트랜스포머의 약한 지역성과 부족한 디코더 집계를 보완해, 이웃 특징을 층마다 줄여 가며 미세한 단서를 모은다.
pubDate: 2026-03-15 09:00:00 +0900
category: paper-review
tags: [cod, transformer]
takeaways:
  - 비전 트랜스포머는 전역 문맥에는 강하지만, 지역성 모델링과 디코더의 특징 집계가 부족해 미세한 단서를 놓친다.
  - NL-TEM이 이웃 토큰을 비지역적으로 상호작용시키고 그래프 기반 고차 관계로 지역 표현을 강화한다.
  - FSD는 이웃한 특징을 AIM으로 합치며 피라미드를 층마다 줄여, 잘 보이지 않는 단서를 최대한 누적한다.
paper:
  title: Feature Shrinkage Pyramid for Camouflaged Object Detection with Transformers
  authors: Zhou Huang, Hang Dai, Tian-Zhu Xiang, Shuo Wang, Huai-Xin Chen, Jie Qin, Huan Xiong
  venue: CVPR 2023
  year: 2023
  url: https://openaccess.thecvf.com/content/CVPR2023/html/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.html
  pdf: https://openaccess.thecvf.com/content/CVPR2023/papers/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.pdf
  code: https://github.com/ZhouHuang23/FSPNet
---

## 문제

비전 트랜스포머는 COD에서 강한 전역 문맥 모델링 능력을 보여 왔다. 하지만 두 가지 한계가 있다.

- **지역성 모델링이 약하다.** 배경과 구분되지 않는 미세한 단서는 주로 지역 패턴에 있다.
- **디코더의 특징 집계가 부족하다.** 여러 층의 특징을 충분히 합치지 못하면 잘 보이지 않는 단서가 사라진다.

## 방법

FSPNet은 지역성이 강화된 트랜스포머 특징을 이웃한 것끼리 **점점 줄여 가며**(progressive shrinking) 계층적으로 디코딩한다.

### Non-Local Token Enhancement Module (NL-TEM)

비지역(non-local) 메커니즘으로 이웃한 토큰들을 상호작용시키고, 토큰 안의 그래프 기반 고차 관계를 탐색해 트랜스포머의 지역 표현을 강화한다.

### Feature Shrinkage Decoder (FSD)

이웃한 트랜스포머 특징을 **인접 상호작용 모듈**(adjacent interaction module, AIM)로 둘씩 합치면서, 층을 하나씩 줄이는 수축 피라미드(shrinkage pyramid) 구조로 집계한다. 한 번에 모든 층을 합치는 대신 이웃끼리 단계적으로 합쳐, 잘 보이지 않지만 유효한 단서를 최대한 누적한다.

## 실험

세 COD 벤치마크와 여섯 가지 평가 지표에서 기존 24개 경쟁 모델을 크게 앞섰다.

## 정리

트랜스포머를 COD에 쓸 때 무엇이 부족한지를 지역성과 디코더 집계, 두 가지로 짚고 각각에 모듈을 붙인 구성이 명확하다. 특히 이웃한 층끼리만 합치는 수축 피라미드는, 서로 너무 다른 해상도의 특징을 한 번에 섞을 때 생기는 문제를 피하는 방법으로 참고할 만하다.

수축 단계가 많아질수록 디코더가 무거워지므로, 경량 모델과 비교할 때는 정확도와 함께 추론 비용을 봐야 한다.
