---
layout: "post"
title: "Source-free Depth for Object Pop-out"
subtitle: "Source-free Depth for Object Pop-out은 직접 측정한 depth 없이도, 추론된 depth map과 3D pop-out prior만으로 object segmentation을 돕겠다는 작업입니다. COD와 SOD를 함께 다루는 generalization 관점이 강합니다."
summary: "Source-free Depth for Object Pop-out은 직접 측정한 depth 없이도, 추론된 depth map과 3D pop-out prior만으로 object segmentation을 돕겠다는 작업입니다. COD와 SOD를 함께 다루는 generalization 관점이 강합니다."
description: "Source-free Depth for Object Pop-out은 직접 측정한 depth 없이도, 추론된 depth map과 3D pop-out prior만으로 object segmentation을 돕겠다는 작업입니다. COD와 SOD를 함께 다루는 generalization 관점이 강합니다."
date: "2026-03-17 09:00:00 +0900"
slug: "source-free-depth-pop-out-iccv2023"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "depth"
  - "iccv2023"
venue: "ICCV 2023"
source_url: "https://openaccess.thecvf.com/content/ICCV2023/html/WU_Source-free_Depth_for_Object_Pop-out_ICCV_2023_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/ICCV2023/papers/WU_Source-free_Depth_for_Object_Pop-out_ICCV_2023_paper.pdf"
---
## 오버뷰

Source-free Depth for Object Pop-out은 직접 측정한 depth 없이도, 추론된 depth map과 3D pop-out prior만으로 object segmentation을 돕겠다는 작업입니다. COD와 SOD를 함께 다루는 generalization 관점이 강합니다.

## 핵심 주장

- source data 없이 depth model만 이용해 object pop-out prior를 segmentation에 이식할 수 있다.
- contact surface representation을 통해 3D reasoning을 segmentation으로 연결한다.
- SOD와 COD 두 과제의 여덟 개 데이터셋에서 성능과 generalizability를 함께 개선한다.

## 초록

이 논문은 depth cue가 useful하지만 직접 depth를 구하기 어렵다는 현실에서 출발합니다. 저자들은 inferred depth map을 object pop-out prior와 결합해 3D space에서 객체를 reasoning하고, segmentation mask의 약한 supervision으로 contact surface를 학습합니다.

초록을 조금 더 풀어보면, 깊이 단서는 시각적 인식에 유용한 것으로 알려져 있습니다. 그러나 깊이를 직접 측정하는 것은 종종 불가능합니다. 하지만 다행히도 최신 학습 기반 방법은 실제 추론을 통해 유망한 깊이 지도를 제공합니다. 이 작업에서 우리는 3D에서 사전에 객체의 "팝아웃"을 사용하여 객체 분할을 위한 깊이 추론 모델을 적용합니다.

## 서론

COD에서 depth는 종종 보조 modality처럼 다뤄지지만, 이 논문은 RGB-D sensor가 없어도 얻을 수 있는 inferred depth를 적극 활용합니다. 그래서 source-free라는 표현이 붙습니다.

서론에서는 특히, 장면에 대한 3D 지식은 시각적 인식 작업을 보완하는 것으로 오랫동안 알려져 왔습니다. 그러나 실제로는 시각적 인식이 2D 이미지만을 사용하여 수행되어야 하는 경우가 많습니다. 또한 우리는 작업 전문화에도 불구하고 최첨단 결과를 제공하는 24가지 방법(•)을 비교합니다. 제안된 방법은 소스가 없는 깊이를 활용하여 깊이 있는 객체가 배경에 비해 더 잘 보이는 공간으로 매핑합니다.

## 본론

핵심 아이디어는 객체가 배경 표면 위로 도드라져 나온다는 3D composition prior입니다. 이 prior를 잘 쓰면 appearance similarity가 큰 장면에서도 object boundaries를 더 잘 reasoning할 수 있습니다.

## 제안방법

저자들은 inferred depth map을 adaptation하고, contact surface intermediate representation을 학습해 purely 3D reasoning으로 object localization을 수행합니다. 이후 이 정보를 semantics와 연결해 segmentation 성능을 높입니다.

방법을 조금 더 자세히 보면, 소스가 없는 깊이 맵의 도메인 격차를 해결하기 위해 우리는 자체 감독 손실과 약한 의미 감독을 모두 사용하여 엔드 투 엔드 방식으로 의미 네트워크와 소스 없는 깊이를 공동으로 미세 조정할 것을 제안합니다. Local Depth Smoothing: 의사 깊이 감독 외에도 의미론적으로 깊이를 제한하는 두 가지 손실을 제안합니다. 따라서 우리는 기하학적 사전확률과 함께 약한 의미론적 단서를 활용할 것을 제안합니다. 제안된 각 손실이 적절하게 동작하는 것을 볼 수 있습니다. 즉, 기준선에 비해 성능이 향상됩니다.

## 실험

이 논문은 여덟 개 데이터셋에 걸친 breadth를 강조합니다. COD 하나의 benchmark에 특화했다기보다, pop-out prior가 여러 related tasks에 통한다는 점을 보여줍니다.

실험 파트를 조금 더 자세히 보면, 또한 우리는 작업 전문화에도 불구하고 최첨단 결과를 제공하는 24가지 방법(•)을 비교합니다. GT 깊이를 사용하는 우리의 방법은 SOTA 방법보다 성능이 뛰어납니다. 소스가 없는 깊이를 사용하는 방법은 SOTA COD 모델에 비해 훨씬 더 잘 일반화됩니다. 마찬가지로 SOTA RGB-D 모델 중 하나인 SPNet의 경우에도 RGB 전용 입력을 사용하는 NC4K 데이터 세트의 성능은 소스가 없는 추가 깊이를 사용하는 것보다 더 좋습니다.

### 메인 실험 결과

Table 2. Quantitative comparison on COD datasets.

| 깊이 사용 | 학회 | 모델 | CAMO (M↓ Fm↑ Sm↑ Em↑) | CHAMELEON (M↓ Fm↑ Sm↑ Em↑) | COD10K (M↓ Fm↑ Sm↑ Em↑) | NC4K (M↓ Fm↑ Sm↑ Em↑) |
| --- | --- | --- | --- | --- | --- | --- |
| RGB | CVPR20 [9] | SINet | .099 .762 .751 .790 | .044 .845 .868 .908 | .051 .708 .771 .832 | .058 .804 .808 .873 |
| RGB | CVPR21 [42] | SLSR | .080 .791 .787 .843 | .030 .866 .889 .938 | .037 .756 .804 .854 | .048 .836 .839 .898 |
| RGB | CVPR21 [78] | MGL-R | .088 .791 .775 .820 | .031 .868 .893 .932 | .035 .767 .813 .874 | .053 .828 .832 .876 |
| RGB | CVPR21 [44] | PFNet | .085 .793 .782 .845 | .033 .859 .882 .927 | .040 .747 .800 .880 | .053 .820 .829 .891 |
| RGB | CVPR21 [32] | UJSC | .072 .812 .800 .861 | .030 .874 .891 .948 | .035 .761 .808 .886 | .047 .838 .841 .900 |
| RGB | IJCAI21 [59] | C2FNet | .079 .802 .796 .856 | .032 .871 .888 .936 | .036 .764 .813 .894 | .049 .831 .838 .898 |
| RGB | ICCV21 [74] | UGTR | .086 .800 .783 .829 | .031 .862 .887 .926 | .036 .769 .816 .873 | .052 .831 .839 .884 |
| RGB | CVPR22 [21] | SegMAR | .080 .799 .794 .857 | .032 .871 .887 .935 | .039 .750 .799 .876 | .050 .828 .836 .893 |
| RGB | CVPR22 [47] | ZoomNet | .074 .818 .801 .858 | .033 .829 .859 .915 | .034 .771 .808 .872 | .045 .841 .843 .893 |
| Source-free RGB-D | MM21 [80] | CDINet | .100 .638 .732 .766 | .036 .787 .879 .903 | .044 .610 .778 .821 | .067 .697 .793 .830 |
| Source-free RGB-D | CVPR21 [19] | DCF | .089 .724 .749 .834 | .037 .821 .850 .923 | .040 .685 .766 .864 | .061 .765 .791 .878 |
| Source-free RGB-D | ICCV21 [81] | CMINet | .087 .798 .782 .827 | .032 .881 .891 .930 | .039 .768 .811 .868 | .053 .832 .839 .888 |
| Source-free RGB-D | ICCV21 [92] | SPNet | .083 .807 .783 .831 | .033 .872 .888 .930 | .037 .776 .808 .869 | .054 .828 .825 .874 |
| Source-free RGB-D | TIP22 [63] | DCMF | .115 .737 .728 .757 | .059 .807 .830 .853 | .063 .679 .748 .776 | .077 .782 .794 .820 |
| Source-free RGB-D | ECCV22 [31] | SPSN | .084 .782 .773 .829 | .032 .866 .887 .932 | .042 .727 .789 .854 | .059 .803 .813 .867 |
| Source-free RGB-D | Ours | PopNet | .073 .821 .806 .869 | .022 .893 .910 .962 | .031 .789 .827 .897 | .043 .852 .852 .908 |

표는 논문의 메인 정량 비교표를 기준으로 줄바꿈과 열 이름만 읽기 좋게 정리했습니다.

## 결론

이 논문은 depth를 보조 input이 아니라, segmentation reasoning을 재구성하는 prior로 다룹니다. COD를 더 넓은 pop-out 문제로 보는 데 도움이 됩니다.

## 논의

최근 COD가 multimodal로 확장되는 흐름에서, 실제 센서가 없어도 쓸 수 있는 inferred depth prior라는 점이 꽤 매력적입니다.

## 출처

- 논문 페이지: https://openaccess.thecvf.com/content/ICCV2023/html/WU_Source-free_Depth_for_Object_Pop-out_ICCV_2023_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/ICCV2023/papers/WU_Source-free_Depth_for_Object_Pop-out_ICCV_2023_paper.pdf
