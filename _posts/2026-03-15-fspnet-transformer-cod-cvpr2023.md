---
layout: "post"
title: "Feature Shrinkage Pyramid for Camouflaged Object Detection With Transformers"
subtitle: "FSPNet은 transformer가 COD에 유리한 global context는 잘 보지만, locality modeling과 decoder aggregation이 약하다는 문제를 짚습니다. 이를 progressive shrinking 기반 pyramid decoder로 보완하는 작업입니다."
summary: "FSPNet은 transformer가 COD에 유리한 global context는 잘 보지만, locality modeling과 decoder aggregation이 약하다는 문제를 짚습니다. 이를 progressive shrinking 기반 pyramid decoder로 보완하는 작업입니다."
description: "FSPNet은 transformer가 COD에 유리한 global context는 잘 보지만, locality modeling과 decoder aggregation이 약하다는 문제를 짚습니다. 이를 progressive shrinking 기반 pyramid decoder로 보완하는 작업입니다."
date: "2026-03-15 09:00:00 +0900"
slug: "fspnet-transformer-cod-cvpr2023"
lang: "ko"
paper: true
categories:
  - "papers"
tags:
  - "paper"
  - "cod"
  - "transformer"
  - "cvpr2023"
venue: "CVPR 2023"
source_url: "https://openaccess.thecvf.com/content/CVPR2023/html/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.html"
pdf_url: "https://openaccess.thecvf.com/content/CVPR2023/papers/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.pdf"
---
## 오버뷰

FSPNet은 transformer가 COD에 유리한 global context는 잘 보지만, locality modeling과 decoder aggregation이 약하다는 문제를 짚습니다. 이를 progressive shrinking 기반 pyramid decoder로 보완하는 작업입니다.

## 핵심 주장

- ViT 계열의 global context만으로는 COD의 subtle local cue를 충분히 살리기 어렵다.
- NL-TEM이 neighboring tokens 간 상호작용과 고차 관계를 통해 locality를 강화한다.
- feature shrinkage pyramid decoder가 transformer feature를 점진적으로 압축하며 더 좋은 decoding을 만든다.

## 초록

이 논문은 transformer 기반 COD에서 locality modeling과 decoder aggregation 부족을 핵심 병목으로 봅니다. 그래서 non-local token enhancement와 feature shrinkage pyramid를 결합해 locality-enhanced neighboring transformer feature를 계층적으로 decode합니다.

초록을 조금 더 풀어보면, 비전 변환기는 최근 위장 개체 감지에서 강력한 전역 컨텍스트 모델링 기능을 보여주었습니다. 그러나 두 가지 주요 제한 사항이 있습니다. 즉, 덜 효과적인 지역성 모델링과 디코더의 불충분한 특징 집계로 인해 구별할 수 없는 배경에서 미묘한 단서를 탐색하는 위장 개체 감지에 도움이 되지 않습니다. 이러한 문제를 해결하기 위해 본 논문에서는 위장된 객체 감지를 위한 점진적인 축소를 통해 지역성이 강화된 이웃 변환기 특징을 계층적으로 디코딩하는 것을 목표로 하는 새로운 변환기 기반 FSPNet(Feature Shrinkage Pyramid Network)을 제안합니다. 특히, 우리는 비로컬 메커니즘을 사용하여 이웃 토큰과 상호 작용하고 토큰 내의 그래프 기반 고차 관계를 탐색하여 변환기의 로컬 표현을 향상시키는 비로컬 토큰 향상 모듈(NL-TEM)을 제안합니다.

## 서론

2023년 시점의 COD에서는 CNN과 transformer의 장단점이 비교적 명확해졌고, FSPNet은 transformer의 빈틈을 메우려는 설계로 읽힙니다.

서론에서는 특히, 위장은 주변 환경과 “완벽하게” 조화를 이루어 포식자(먹이)를 속이거나 먹이(사냥꾼)에게 몰래 다가가는 유기체의 일반적인 방어 또는 전술입니다. 위장 객체 감지(COD)는 장면에서 위장 객체를 분할하는 것을 목표로 하며 널리 사용되었습니다. 위장된 물체와 배경 사이의 높은 유사성으로 인해 위장된 물체는 일반적으로 눈에 띄지 않고 구별할 수 없으며 이는 정확한 감지에 큰 어려움을 가져옵니다. 변환기의 전역 컨텍스트 모델링, 토큰 내의 위치 탐색 및 점진적 기능 축소 디코더로 인해 제안된 모델은 최첨단 성능을 달성하고 정확하고 완전한 위장 객체 분할을 제공합니다.

## 본론

FSPNet은 큰 구조 혁신보다, transformer가 놓치는 local relation을 어떻게 보강할지를 세밀하게 다듬습니다. COD처럼 경계와 미세한 texture가 중요한 문제에서 이런 접근이 잘 맞습니다.

## 제안방법

NL-TEM이 non-local mechanism과 graph-based high-order relation으로 token locality를 높이고, feature shrinkage pyramid가 이를 progressive shrinking으로 decode합니다.

방법을 조금 더 자세히 보면, 또한 FSD 디코더에서는 현재 인접 특징 쌍과 이전 AIM에서 출력된 집계 특징을 상호 작용하고 병합하고 현재 집계된 특징을 다음 레이어와 다음 AIM으로 전달하는 AIM(인접 상호 작용 모듈)을 제안합니다. 와 달리 제안된 FSD는 교차 레이어 기능 상호 작용을 채택할 뿐만 아니라 동일한 레이어 내에서 기능 상호 작용도 채택하여 피라미드 구조에서 효과적인 기능의 흐름과 축적을 향상시켜 디코더 프로세스에서 미묘하지만 중요한 기능의 손실을 최소화합니다. 최근 제안된 최신 ZoomNet과 비교하여, 우리의 방법은 이 세 가지 데이터 세트에서 Sα, F w β, F m β, Em ψ, Ex 및 M 측면에서 각각 3.0%, 3.7%, 2.7%, 1.8%, 3.0% 및 17.7%의 평균 성능 향상을 달성합니다. 그림 2(5~7번째)는 다양한 백본 기능 조합에서 제안된 디코더 FSD(D로 표시)의 결과를 보여줍니다.

## 실험

실험의 메시지는 transformer backbone을 COD에 맞게 손보면 local cue와 decoding 문제를 줄일 수 있다는 것입니다.

실험 파트를 조금 더 자세히 보면, 광범위한 정량적 및 정성적 실험을 통해 제안된 모델이 널리 사용되는 6가지 평가 측정 기준에 따라 3가지 까다로운 COD 벤치마크 데이터 세트에서 기존 24개 경쟁사보다 훨씬 뛰어난 성능을 발휘함을 보여줍니다. 그림 1은 6가지 평가 지표에 따라 3가지 까다로운 COD 벤치마크 데이터 세트에 대해 24개 경쟁사에 대해 제안된 방법의 정량적 결과를 요약합니다. 최근 제안된 최신 ZoomNet과 비교하여, 우리의 방법은 이 세 가지 데이터 세트에서 Sα, F w β, F m β, Em ψ, Ex 및 M 측면에서 각각 3.0%, 3.7%, 2.7%, 1.8%, 3.0% 및 17.7%의 평균 성능 향상을 달성합니다. 광범위한 비교 실험 및 절제 연구에 따르면 제안된 FSPNet은 널리 사용되는 3가지 COD 벤치마크 데이터 세트에서 24가지 최첨단 접근 방식보다 우수한 성능을 달성합니다.

### 메인 실험 결과

Table 1. Quantitative comparison with 24 SOTA methods on three benchmark datasets.

| 구분 | 모델 | CAMO (Sm↑ Fωβ↑ Fmβ↑ Emϕ↑ Exϕ↑ M↓) | COD10K (Sm↑ Fωβ↑ Fmβ↑ Emϕ↑ Exϕ↑ M↓) | NC4K (Sm↑ Fωβ↑ Fmβ↑ Emϕ↑ Exϕ↑ M↓) |
| --- | --- | --- | --- | --- |
| Salient Object Detection | BASNet19 | .618 .413 .475 .661 .708 .159 | .634 .365 .417 .678 .735 .105 | .695 .546 .610 .762 .786 .095 |
| Salient Object Detection | CPD19 | .716 .556 .618 .723 .796 .113 | .750 .531 .595 .776 .853 .053 | .717 .551 .597 .724 .793 .092 |
| Salient Object Detection | EGNet19 | .662 .495 .567 .683 .780 .125 | .733 .519 .583 .761 .836 .055 | .767 .626 .689 .793 .850 .077 |
| Salient Object Detection | SCRN19 | .779 .643 .705 .797 .850 .090 | .789 .575 .651 .817 .880 .047 | .830 .698 .757 .854 .897 .059 |
| Salient Object Detection | F3Net20 | .711 .564 .616 .741 .780 .109 | .739 .544 .593 .795 .819 .051 | .780 .656 .705 .824 .848 .070 |
| Salient Object Detection | CSNet20 | .771 .642 .705 .795 .849 .092 | .778 .569 .635 .810 .871 .047 | .750 .603 .655 .773 .793 .088 |
| Salient Object Detection | SSAL20 | .644 .493 .579 .721 .780 .126 | .668 .454 .527 .768 .789 .066 | .699 .561 .644 .780 .812 .093 |
| Salient Object Detection | ITSD20 | .750 .610 .663 .780 .830 .102 | .767 .557 .615 .808 .861 .051 | .811 .680 .729 .845 .883 .064 |
| Salient Object Detection | UCNet20 | .739 .640 .700 .787 .820 .094 | .776 .633 .681 .857 .867 .042 | .811 .729 .775 .871 .886 .055 |
| Salient Object Detection | VST21 | .787 .691 .738 .838 .866 .076 | .781 .604 .653 .837 .877 .042 | .831 .732 .771 .877 .901 .050 |
| Camouflaged Object Detection | SINet20 | .751 .606 .675 .771 .831 .100 | .771 .551 .634 .806 .868 .051 | .808 .723 .769 .871 .883 .058 |
| Camouflaged Object Detection | SLSR21 | .787 .696 .744 .838 .854 .080 | .804 .673 .715 .880 .892 .037 | .840 .766 .804 .895 .907 .048 |
| Camouflaged Object Detection | PFNet21 | .782 .695 .746 .842 .855 .085 | .800 .660 .701 .877 .890 .040 | .829 .745 .784 .888 .898 .053 |
| Camouflaged Object Detection | MGL-R21 | .775 .673 .726 .812 .842 .088 | .814 .666 .711 .852 .890 .035 | .833 .740 .782 .867 .893 .052 |
| Camouflaged Object Detection | UJSC21 | .800 .728 .772 .859 .873 .073 | .809 .684 .721 .884 .891 .035 | .842 .771 .806 .898 .907 .047 |
| Camouflaged Object Detection | C2FNet21 | .796 .719 .762 .854 .864 .080 | .813 .686 .723 .890 .900 .036 | .838 .762 .795 .897 .904 .049 |
| Camouflaged Object Detection | UGTR21 | .784 .684 .735 .822 .851 .086 | .817 .666 .712 .853 .890 .036 | .839 .747 .787 .875 .899 .052 |
| Camouflaged Object Detection | PreyNet22 | .790 .708 .757 .842 .857 .077 | .813 .697 .736 .881 .891 .034 | – – – – – – |
| Camouflaged Object Detection | BSA-Net22 | .794 .717 .763 .851 .867 .079 | .818 .699 .738 .891 .901 .034 | .841 .771 .808 .897 .907 .048 |
| Camouflaged Object Detection | OCE-Net22 | .802 .723 .766 .852 .865 .080 | .827 .707 .741 .894 .905 .033 | .853 .785 .818 .903 .913 .045 |
| Camouflaged Object Detection | BGNet22 | .812 .749 .789 .870 .882 .073 | .831 .722 .753 .901 .911 .033 | .851 .788 .820 .907 .916 .044 |
| Camouflaged Object Detection | SegMaR22 | .815 .753 .795 .874 .884 .071 | .833 .724 .757 .899 .906 .034 | .841 .781 .820 .896 .907 .046 |
| Camouflaged Object Detection | ZoomNet22 | .820 .752 .794 .878 .892 .066 | .838 .729 .766 .888 .911 .029 | .853 .784 .818 .896 .912 .043 |
| Camouflaged Object Detection | SINet-v222 | .820 .743 .782 .882 .895 .070 | .815 .680 .718 .887 .906 .037 | .847 .770 .805 .903 .914 .048 |
| Camouflaged Object Detection | Ours | .856 .799 .830 .899 .928 .050 | .851 .735 .769 .895 .930 .026 | .879 .816 .843 .915 .937 .035 |

표는 논문의 메인 정량 비교표를 기준으로 줄바꿈과 열 이름만 읽기 좋게 정리했습니다.

## 결론

FSPNet은 transformer 기반 COD의 약점을 정면으로 고친 실전형 논문입니다.

## 논의

지금 보면 더 큰 foundation model이 많지만, local cue를 어떻게 붙이느냐는 여전히 남아 있는 문제라서 읽을 가치가 있습니다.

## 출처

- 논문 페이지: https://openaccess.thecvf.com/content/CVPR2023/html/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.html
- 원문 PDF: https://openaccess.thecvf.com/content/CVPR2023/papers/Huang_Feature_Shrinkage_Pyramid_for_Camouflaged_Object_Detection_With_Transformers_CVPR_2023_paper.pdf
