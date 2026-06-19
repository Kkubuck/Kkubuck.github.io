---
layout: "post"
title: "VSCode: General Visual Salient and Camouflaged Object Detection with 2D Prompt Learning"
subtitle: "VSCode는 SOD와 COD를 task-specific specialist 모델로 따로따로 만드는 흐름에 반대합니다. 하나의 generalist model 안에서 domain과 task를 2D prompt로 분리해, 여러 binary mapping task를 동시에 다루는 방향입니다."
summary: "VSCode는 SOD와 COD를 task-specific specialist 모델로 따로따로 만드는 흐름에 반대합니다. 하나의 generalist model 안에서 domain과 task를 2D prompt로 분리해, 여러 binary mapping task를 동시에 다루는 방향입니다."
description: "VSCode는 SOD와 COD를 task-specific specialist 모델로 따로따로 만드는 흐름에 반대합니다. 하나의 generalist model 안에서 domain과 task를 2D prompt로 분리해, 여러 binary mapping task를 동시에 다루는 방향입니다."
date: "2026-03-20 09:00:00 +0900"
slug: "vscode-generalist-cod-cvpr2024"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "sod"
  - "cvpr2024"
venue: "CVPR 2024"
source_url: "https://openaccess.thecvf.com/content/CVPR2024/html/Luo_VSCode_General_Visual_Salient_and_Camouflaged_Object_Detection_with_2D_CVPR_2024_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2024/papers/Luo_VSCode_General_Visual_Salient_and_Camouflaged_Object_Detection_with_2D_CVPR_2024_paper.pdf"
---
## 오버뷰

VSCode는 SOD와 COD를 task-specific specialist 모델로 따로따로 만드는 흐름에 반대합니다. 하나의 generalist model 안에서 domain과 task를 2D prompt로 분리해, 여러 binary mapping task를 동시에 다루는 방향입니다.

## 핵심 주장

- SOD와 COD는 서로 닿아 있는 문제이므로 완전히 분리된 specialist 설계는 비효율적이다.
- 2D prompt learning으로 domain-specific 지식과 task-specific 지식을 따로 학습할 수 있다.
- 6개 task, 26개 데이터셋에서 SOTA를 넘고, RGB-D COD 같은 unseen task에도 zero-shot generalization을 보인다.

## 초록

기존 연구는 여러 salient/camouflaged detection task마다 복잡한 specialist를 두는 경향이 있습니다. VSCode는 이를 generalist framing으로 바꾸고, encoder-decoder 안에 2D prompts를 넣어 domain과 task라는 두 축의 지식을 동시에 학습합니다.

초록을 조금 더 풀어보면, SOD(주요 객체 감지)와 COD(위장 객체 감지)는 서로 관련되어 있지만 별개의 이진 매핑 방식과 고유한 단서입니다. 기존 연구에서는 종종 복잡한 작업별 전문가 모델을 사용하여 잠재적으로 중복성과 차선의 결과를 초래할 수 있습니다. 4가지 SOD 작업과 3가지 COD 작업을 공동으로 해결하기 위해 새로운 2D 프롬프트 학습 기능을 갖춘 일반 모델인 VSCode를 소개합니다. 우리는 VST를 기초 모델로 활용하고 인코더-디코더 아키텍처 내에 2D 프롬프트를 도입하여 두 가지 개별 차원에 대한 도메인 및 작업별 지식을 학습합니다.

## 서론

이 논문은 COD만 따로 잘하는 모델보다, 비슷한 binary detection task를 함께 학습했을 때 더 일반적인 표현을 얻을 수 있다는 문제의식을 갖습니다. 그래서 task unification이 핵심 키워드입니다.

서론에서는 특히, 시각적으로 두드러진 개체 감지(SOD)와 위장된 개체 감지(COD)는 서로 연결되어 있지만 고유한 두 가지 작업입니다. SOD의 목표는 이미지 내에서 주변 환경과 크게 대조되는 눈에 띄는 객체를 식별하는 것입니다. 이를 통해 분할, 감지 및 부분-객체 관계형 시각적 돌출성을 촉진하는 데 사용할 수 있습니다. 한편으로는, 모든 작업의 공통점과 특성을 동시에 처리하는 것은 서로 다른 작업 간의 비호환성으로 인해 간단한 공동 훈련으로 성과가 쉽게 저하되기 때문에 중요한 과제를 제기합니다. 한편, 최근 매개변수 효율적인 프롬프트 기술의 출현에 영감을 받아 작업 특성을 포착하기 위한 2D 프롬프트를 제안합니다.

## 본론

VSCode의 장점은 SOD와 COD를 묶되, 서로 다른 부분까지 뭉개지 않게 2D prompt로 disentangle하는 데 있습니다. 즉 하나로 합치되, 아무렇게나 합치지 않는 전략입니다.

## 제안방법

저자들은 VST 기반 구조 안에 2D prompts를 넣고, prompt discrimination loss로 domain/task peculiarities를 분리해 학습합니다. 이 설계 덕분에 unseen task 조합에도 유연성이 생깁니다.

방법을 조금 더 자세히 보면, 따라서 위장된 개체에는 디코더 내에서 보다 정교한 프로세스가 필요하므로 인코더에 작업별 프롬프트만 도입하는 것만으로는 충분하지 않을 수 있습니다. 우리는 인코더에 의해 추출된 특징을 기반으로 경계와 객체 영역을 모두 재구성하기 위해 뚜렷한 주의를 할당하기 위해 디코더에 작업별 프롬프트를 통합합니다. 디코더의 작업별 프롬프트와 관련하여 학습 가능한 프롬프트 ptd j+1 ∈RN×d를 디코더의 특정 블록 j+1의 디코더 기능 토큰 f D j+1에 추가하기만 하면 됩니다. 따라서 우리는 동일한 유형의 프롬프트 간의 상관 관계를 최소화하고 각 프롬프트가 고유한 도메인 또는 작업 지식을 획득하도록 보장하기 위해 프롬프트 식별 손실을 제안합니다.

## 실험

대표 메시지는 breadth입니다. 단일 COD benchmark에서 소폭 이기는 것이 아니라, 26 datasets across six tasks와 zero-shot generalization을 함께 보여줍니다.

실험 파트를 조금 더 자세히 보면, 데이터 세트 및 평가 지표 RGB SOD의 경우 일반적으로 사용되는 6개의 벤치마크 데이터 세트를 사용하여 제안된 모델을 평가합니다. 즉, VSOD의 경우 널리 사용되는 6개의 벤치마크 데이터 세트인 DAVIS, FBMS, ViSal, SegV2, DAVSOD-Easy 및 DAVSOD-Normal을 사용합니다. VCOD의 경우 널리 사용되는 두 가지 벤치마크 데이터 세트인 CAD와 MoCA-Mask를 활용합니다. Params CAD MoCA-마스크(M) Sm ↑Fm ↑Em ↑ Sm ↑Fm ↑Em ↑ PNS-Net 26.87.671.473.787.514.068.599 RCRNet 53.79.664.405.786.559.170.593 MG.608.378.673.500.138.514 SLT-Net 164.68.715.542.823.624.327.768 VSCode-T 54.09.757.659.808.650.339.787 VSCode-S 74.72.790.680.853.665.386.796 두 개의 벤치마크 데이터 세트에 대한 SOTA VCOD 방법.

### 메인 실험 결과

| 모델 | Params (M) | NJUD (Sm↑ Fm↑ Em↑) | NLPR (Sm↑ Fm↑ Em↑) | DUTLF-Depth (Sm↑ Fm↑ Em↑) | ReDWeb-S (Sm↑ Fm↑ Em↑) | STERE (Sm↑ Fm↑ Em↑) | SIP (Sm↑ Fm↑ Em↑) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CMINet[103] | 188.12 | .929 .934 .957 | .932 .922 .963 | .912 .913 .938 | .725 .726 .800 | .918 .916 .951 | .899 .910 .939 |
| VST[54] | 53.83 | .922 .920 .951 | .932 .920 .962 | .943 .948 .969 | .759 .763 .826 | .913 .907 .951 | .904 .915 .944 |
| VST-T++ [50] | 100.51 | .928 .929 .958 | .933 .921 .964 | .944 .948 .969 | .756 .757 .819 | .916 .911 .950 | .903 .914 .944 |
| SPSN[38] | - | - - - | .923 .912 .960 | - - - | - - - | .907 .902 .945 | .892 .900 .936 |
| CAVER[68] | 55.79 | .920 .924 .953 | .929 .921 .964 | .931 .939 .962 | .730 .724 .802 | .914 .911 .951 | .893 .906 .934 |
| VSCode-T | 54.09 | .941 .945 .967 | .938 .930 .966 | .952 .959 .974 | .766 .771 .831 | .928 .926 .957 | .917 .936 .955 |
| VSCode-S | 74.72 | .944 .949 .970 | .941 .932 .968 | .960 .967 .980 | .777 .776 .829 | .931 .928 .958 | .924 .942 .958 |

표는 논문의 메인 정량 비교표를 기준으로 줄바꿈과 열 이름만 읽기 좋게 정리했습니다.

## 결론

VSCode는 COD를 단독 작업으로만 보지 않고, broader visual pop-out 문제의 한 축으로 묶어 읽게 만드는 논문입니다.

## 논의

개별 benchmark 리더보드보다 범용성을 보려면 이런 generalist 계열이 더 중요해질 것 같습니다. 특히 future multimodal COD와도 잘 연결됩니다.

## 출처

- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2024/html/Luo_VSCode_General_Visual_Salient_and_Camouflaged_Object_Detection_with_2D_CVPR_2024_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2024/papers/Luo_VSCode_General_Visual_Salient_and_Camouflaged_Object_Detection_with_2D_CVPR_2024_paper.pdf
