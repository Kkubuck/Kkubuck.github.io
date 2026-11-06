import Link from 'next/link';
import { Fragment } from 'react';
import { pageMetadata } from '@/lib/metadata';
import { typesetTitle } from '@/lib/keep-parens';
import { routes } from '@/lib/paths';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export const metadata = pageMetadata({
  title: '소개',
  description: '컴퓨터 비전을 연구하는 이지상의 소개와 논문, 프로젝트입니다.',
  path: routes.about()
});

const LINKS = [
  { label: 'GitHub', href: SITE.links.github, text: 'github.com/Kkubuck' },
  { label: 'Scholar', href: SITE.links.scholar, text: 'Google Scholar' },
  { label: 'LinkedIn', href: SITE.links.linkedin, text: 'linkedin.com/in/jisanglee' },
  { label: 'Email', href: `mailto:${SITE.links.email}`, text: SITE.links.email }
];

type Entry = {
  title: string;
  summary: string;
  meta: string;
  links?: { label: string; href: string }[];
};

/** First-author papers, newest first. The full list lives on the GitHub profile. */
const PUBLICATIONS: Entry[] = [
  {
    title: 'SARR-Net: Sensor-Aware Relation Routing for Multispectral Camouflaged Object Detection',
    summary: '다중분광 영상의 파장 간 대비를 센서별 관계로 정리해 위장 객체의 전경과 경계를 복원합니다.',
    meta: 'IEEE Transactions on Multimedia · 2026 · 게재 승인'
  },
  {
    title: 'HFGF-DINOv3: High-Frequency Guided Fusion and Phase-Aware Loss for Camouflaged Object Detection',
    summary: 'DINOv3를 적은 파라미터로 위장 객체 탐지에 맞추고, 고주파 경계 단서로 흐린 경계를 보강합니다.',
    meta: 'Pattern Recognition · 2027',
    links: [
      { label: '논문', href: 'https://doi.org/10.1016/j.patcog.2026.115066' },
      { label: '코드', href: 'https://github.com/Kkubuck/HFGF-DINOv3' }
    ]
  },
  {
    title:
      'Uncertainty-Guided Structural Routing and Consensus-Aware Re-Ranking for Open-Vocabulary Camouflaged Object Segmentation',
    summary: '마스크 분할과 범주 인식을 분리하고, 구조 사전 정보와 합의 기반 재순위화로 각각을 안정화합니다.',
    meta: 'ACCV · 2026 · 공동 제1저자',
    links: [{ label: '코드', href: 'https://github.com/Kkubuck/IDS-SAM' }]
  },
  {
    title: 'Parcel-Based Crop Type Classification in UAV Imagery with SAM for Smallholder Farms',
    summary: 'SAM으로 나눈 필지 단위로 작물을 분류해, 화소 단위 분할보다 높은 정확도를 얻었습니다.',
    meta: 'Korean Journal of Remote Sensing · 2024',
    links: [{ label: '논문', href: 'https://doi.org/10.7780/kjrs.2024.40.5.1.7' }]
  }
];

/** Newest first. */
const PROJECTS: Entry[] = [
  {
    title: '군용 차량 개방 어휘 제로샷 탐지',
    summary: '비전-언어 모델로 학습 때 보지 못한 군용 차량 범주를 탐지하는 방법을 연구했습니다.',
    meta: 'DataMaker 공동연구 · 2025.01 – 2025.10'
  },
  {
    title: 'UAV 영상 필지 기반 작물 분류',
    summary: 'SAM 기반 필지 분할 모델을 개선했고, 결과를 대한원격탐사학회지 논문으로 발표했습니다.',
    meta: 'SI Analytics 연구 인턴 · 2024.07 – 2024.09'
  },
  {
    title: 'SAR 영상 분석과 의미 분할',
    summary: 'SAR 잡음 제거, 생성 모델 기반 데이터 증강, 지식 증류를 분할 모델에 적용해 캡스톤디자인 금상을 받았습니다.',
    meta: 'SkyPixel 캡스톤디자인 · 2024.01 – 2024.12'
  },
  {
    title: '신생아 호흡곤란증후군 X-ray 진단',
    summary: '신생아 흉부 X-ray의 폐 분할·분류 모델을 만들고, Grad-CAM으로 판단 근거를 확인했습니다.',
    meta: '충남대학교병원 공동연구 · 2023.01 – 2023.07'
  }
];

function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <ul className="about__list">
      {entries.map((entry) => (
        <li key={entry.title}>
          <strong>{typesetTitle(entry.title, 14)}</strong>
          <p>{entry.summary}</p>
          <span>
            {entry.meta}
            {entry.links?.map((link) => (
              <Fragment key={link.href}>
                {' · '}
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </Fragment>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  return (
    <div className="wrap">
      <header className="page-header">
        <h1 className="page-header__title">소개</h1>
      </header>

      <div className="about">
        <p className="about__name">
          이지상 <span>Jisang Lee</span>
        </p>
        <p>
          국립한밭대학교 컴퓨터공학과 석사과정이고, AIM Lab(지도교수 장한얼)에서 컴퓨터 비전을 연구합니다. 배경과 구분하기
          어려운 대상을 찾는 위장 객체 탐지와 분할이 주제이고, DINOv3·SAM·CLIP 같은 비전 기반 모델과 비전-언어 모델을 이
          문제에 맞게 적응시키는 방법을 다룹니다. 다중분광, SAR, UAV 영상처럼 일반 RGB와 다른 센서 데이터도 함께 연구합니다.
        </p>
        <p>
          이 블로그에는 공부하면서 정리한 내용을 올립니다. 예전 Tistory 블로그에 쓴 글도{' '}
          <Link href={routes.category('study')}>공부</Link>와{' '}
          <Link href={routes.category('coding-test')}>코딩 테스트</Link> 카테고리로 옮겨 두었습니다.
        </p>

        <h2>논문</h2>
        <p className="about__lead">제1저자로 쓴 논문입니다.</p>
        <EntryList entries={PUBLICATIONS} />
        <p className="about__more">
          국제 학술지 3편이 심사 중이고, 국내 학술지 6편과 학술대회 7편(우수논문상 3회)이 있습니다.
        </p>

        <h2>프로젝트</h2>
        <EntryList entries={PROJECTS} />

        <h2>연락처</h2>
        <dl className="about__links">
          {LINKS.map((link) => {
            const external = link.href.startsWith('http');
            return (
              <div key={link.label}>
                <dt>{link.label}</dt>
                <dd>
                  <a
                    href={link.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                  >
                    {link.text}
                  </a>
                </dd>
              </div>
            );
          })}
        </dl>
        <p className="about__more">
          전체 논문 목록과 경진대회 수상 내역은{' '}
          <a href={SITE.links.github} target="_blank" rel="noopener noreferrer">
            GitHub 프로필
          </a>
          에 정리해 두었습니다.
        </p>
      </div>
    </div>
  );
}
