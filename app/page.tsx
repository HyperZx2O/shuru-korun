'use client'

import { useLocale } from '@/components/providers/LocaleProvider'

export default function Home() {
  const { locale } = useLocale()
  const t = locale === 'bn'
    ? {
        heroTitle: 'একটি ব্যবসা শুরু করুন, এক ধাপে এক ধাপ।',
        heroSentence: 'বাংলাদেশের প্রথমবারের উদ্যোক্তাদের জন্য একটি বিনামূল্যের গাইড।',
        startMyPath: 'আমার পথ শুরু করুন',
        seeRoadmap: 'একটি বাস্তব রোডম্যাপ দেখুন',
        noBroker: 'কোনো ব্রোকার লাগবে না।',
        step1Title: 'কোন অফিসে যাবেন তা নিশ্চিত করুন',
        step1Meta: 'ঢাকা উত্তর, ঢাকা দক্ষিণ, বা আপনার পৌরসভা',
        step2Title: 'প্রয়োজনীয় কাগজপত্র সংগ্রহ করুন',
        step2Meta: 'NID, ছবি, ভাড়ার প্রমাণ, হোল্ডিং ট্যাক্স',
        step5Title: 'ফি পরিশোধ করুন',
        step5Meta: 'BDT ১০০ থেকে ৪০,০০০, ব্যবসার ধরন অনুযায়ী',
        datedSource: 'পুরোনো সূত্র',
        confirm: 'নিশ্চিত করুন',
        rangeOnly: 'শুধু পরিসর',
        sourcesTitle: 'অনুমান নয়, সূত্র থেকে তৈরি।',
        sourcesBody: 'প্রতিটি ফি একটি পরিসর। প্রতিটি ধাপ বলে আমরা কতটা নিশ্চিত এবং কখন সর্বশেষ যাচাই করেছি।',
        verified: 'যাচাইকৃত',
        verifiedBody: 'গত এক বছরে লোড করা একটি অফিসিয়াল সূত্র।',
        datedBody: 'অফিসের পাতা আছে, কিন্তু বছর আগে প্রকাশিত। ফিগারটি একটি সূত্র হিসেবে নিন।',
        confirmBody: 'নিয়ম এলাকাভেদে আলাদা, বা সূত্র অফিসিয়াল নয়। পরিশোধের আগে জিজ্ঞাসা করুন।',
        howTitle: 'পাঁচটি প্রশ্ন। তারপর আপনার পথ।',
        how1: 'পাঁচটি দ্রুত প্রশ্নের উত্তর দিন',
        how1b: 'আপনি কী বিক্রি করেন, কোথায়, কীভাবে, এবং খাদ্য কিনা।',
        how2: 'আপনার ব্যবসার জন্য একটি রোডম্যাপ পান',
        how2b: 'শুধু প্রযোজ্য ধাপগুলো, অফিস যে ক্রমে চাইবে সেই ক্রমে।',
        how3: 'ধাপে ধাপে এগিয়ে যান',
        how3b: 'যা শেষ করেছেন চিহ্নিত করুন, রিমাইন্ডার রাখুন, অস্পষ্ট নিয়মে জিজ্ঞাসা করুন।',
        sellersTitle: 'বাসার রান্না, দোকান এবং অনলাইন বিক্রেতাদের জন্য।',
        sellersBody: 'বাসার খাবার, কাপড়ের দোকান, ফেসবুক পেজ। কীভাবে এবং কোথায় বিক্রি করেন তার ওপর পথ বদলায়, এবং আপনার উত্তর ঠিক করে কোন ধাপ প্রযোজ্য।',
        sellersBody2: 'শুধু অনলাইনে বিক্রি? DBID লাগতে পারে, ট্রেড লাইসেন্স নয়।',
        startAnswers: 'আপনার উত্তর দিয়ে শুরু করুন',
        stepTitle: 'একটি ধাপ কেমন দেখায়।',
        stepBody: 'ট্রেড লাইসেন্স পথের একটি বাস্তব ধাপ।',
        feeTitle: 'ফি পরিশোধ করুন (শুধু পরিসর)',
        feeBody: 'ব্যবসার ধরন অনুযায়ী ফি BDT ১০০ থেকে ৪০,০০০ পর্যন্ত। পোর্টাল ক্যালকুলেটর থেকে সুনির্দিষ্ট ফিগার নিশ্চিত করুন।',
        nid: 'NID, মূল ও সত্যায়িত কপি',
        rent: 'ভাড়ার রসিদ বা মালিকানার প্রমাণ',
        holding: 'হোল্ডিং ট্যাক্স রসিদ',
        factValue: 'BDT ১০০ থেকে ৪০,০০০',
        factRange: 'শুধু পরিসর, ব্যবসার ধরন অনুযায়ী',
        checked: 'যাচাই করা হয়েছে ১ নভেম্বর ২০২৬',
        scamTitle: 'কোনো ব্রোকার আগে নগদ চাইলে।',
        scamBody: 'ফাইল করতে আপনার কোনো এজেন্ট লাগবে না। এই গাইডের প্রতিটি ফর্ম অফিসিয়াল পোর্টালে বা অফিস কাউন্টারে। কেউ ফি-এর বিনিময়ে লাইসেন্স গ্যারান্টি দিলে, সরে যান।',
        readScam: 'স্ক্যাম শিল্ড পড়ুন',
        askTitle: 'বাংলা, ইংরেজি বা বাংলিশে জিজ্ঞাসা করুন।',
        askBody: 'শুরু এই গাইডের নিজস্ব নিয়ম-কানুনের তথ্য থেকে উত্তর দেয়। যখন জানে না তখন বলে, এবং কখনো ফি আবিষ্কার করে না।',
        askQ: 'ফেসবুকে বিক্রি করতে কি ট্রেড লাইসেন্স লাগবে?',
        askA: 'দোকান বা বাসা থেকে বিক্রি করলে, হ্যাঁ। শুধু অনলাইন বিক্রেতাদের সিটি কর্পোরেশনের সাথে নিশ্চিত করতে হবে। DBID একটি আলাদা রেজিস্ট্রেশন।',
        askLink: 'শুরুকে একটি প্রশ্ন করুন',
        photos: 'ছবি:',
      }
    : {
        heroTitle: 'Start a business, step by step.',
        heroSentence: 'A free guide for first-time founders in Bangladesh.',
        startMyPath: 'Start my path',
        seeRoadmap: 'See a real roadmap',
        noBroker: 'No broker needed.',
        step1Title: 'Confirm which office handles your area',
        step1Meta: 'Dhaka North, Dhaka South, or your municipality',
        step2Title: 'Gather the required documents',
        step2Meta: 'NID, photos, rent proof, holding tax',
        step5Title: 'Pay the fee',
        step5Meta: 'BDT 100 to 40,000, by business type',
        datedSource: 'Dated source',
        confirm: 'Confirm',
        rangeOnly: 'Range only',
        sourcesTitle: 'Built from sources, not guesses.',
        sourcesBody: 'Every fee is a range, and every step says how sure we are.',
        verified: 'Verified',
        verifiedBody: 'An official source we loaded in the last year.',
        datedBody: 'The office page exists, but it was published years ago.',
        confirmBody: 'Rules differ by area. Ask before you pay.',
        howTitle: 'Five questions. Then your path.',
        how1: 'Answer five quick questions',
        how1b: 'What you sell, where, how, and whether you sell food.',
        how2: 'Get a roadmap for your business',
        how2b: 'Only the steps that apply, in office order.',
        how3: 'Work through it, one step at a time',
        how3b: 'Mark what you finish and keep reminders.',
        sellersTitle: 'For home kitchens, shops, and online sellers.',
        sellersBody: 'A home kitchen, a cloth shop, a Facebook page. Your answers decide which steps apply.',
        sellersBody2: 'Online-only? You may need a DBID instead.',
        startAnswers: 'Start with your answers',
        stepTitle: 'What a step looks like.',
        stepBody: 'A real step from the trade licence path.',
        feeTitle: 'Pay the fee (range only)',
        feeBody: 'The fee ranges from BDT 100 to 40,000 by business type.',
        nid: 'NID, original and attested copy',
        rent: 'Rent receipt or ownership proof',
        holding: 'Holding tax receipt',
        factValue: 'BDT 100 to 40,000',
        factRange: 'Range only, by business type',
        checked: 'Checked 1 November 2026',
        scamTitle: 'When a broker asks for cash upfront.',
        scamBody: 'You do not need an agent. Every form is on an official portal or at an office counter. If someone guarantees a licence for a fee, walk away.',
        readScam: 'Read the scam shield',
        askTitle: 'Ask in Bangla, English, or Banglish.',
        askBody: 'Shuru answers from this guide’s rules data.',
        askQ: 'Do I need a trade licence to sell on Facebook?',
        askA: 'If you sell from a shop or home, yes. Online-only sellers should confirm. A DBID is separate.',
        askLink: 'Ask Shuru a question',
        photos: 'Photographs:',
      }

  return (
    <>
      <section className="container hero" aria-labelledby="hero-title">
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title" className="display hero-title">
              {locale === 'bn' ? 'একটি ব্যবসা শুরু করুন, ' : 'Start a business, '}
              <mark>{locale === 'bn' ? 'ধাপে ধাপে।' : 'step by step.'}</mark>
            </h1>
            <p className="hero-sentence">{t.heroSentence}</p>
            <div className="hero-actions">
              <a href="/path" className="btn btn--primary">
                {t.startMyPath}
              </a>
              <a
                href="/roadmap?sells=retail&area=dhaka-north&channels=shop&premises=rented&food=false"
                className="link"
              >
                {t.seeRoadmap}
              </a>
            </div>
            <p className="hero-note">{t.noBroker}</p>
          </div>

          <div className="hero-pear torn-b">
            <div className="stack" aria-label={locale === 'bn' ? 'একটি নমুনা রোডম্যাপ' : 'A sample roadmap'}>
            <article className="stack-card peel" style={{ animationDelay: '0ms' }}>
              <span className="stack-num">01</span>
              <span>
                <span className="stack-title">{t.step1Title}</span>
                <span className="stack-meta">{t.step1Meta}</span>
              </span>
              <span className="status status--dated">{t.datedSource}</span>
            </article>
            <article className="stack-card peel" style={{ animationDelay: '120ms' }}>
              <span className="stack-num">02</span>
              <span>
                <span className="stack-title">{t.step2Title}</span>
                <span className="stack-meta">{t.step2Meta}</span>
              </span>
              <span className="status status--confirm">{t.confirm}</span>
            </article>
            <article className="stack-card peel" style={{ animationDelay: '240ms' }}>
              <span className="stack-num">05</span>
              <span>
                <span className="stack-title">{t.step5Title}</span>
                <span className="stack-meta">{t.step5Meta}</span>
              </span>
              <span className="status status--dated">{t.rangeOnly}</span>
            </article>
            </div>
          </div>
        </div>
      </section>

      <section className="container section" aria-labelledby="sources-title">
        <div className="section-head">
          <h2 id="sources-title">{t.sourcesTitle}</h2>
        </div>
        <div className="grid-3">
          <article className="tile">
            <span className="status status--verified">{t.verified}</span>
            <h3>{locale === 'bn' ? 'কোন অফিসে যাবেন তা নিশ্চিত করুন' : 'Confirm which office handles your area'}</h3>
            <p>{t.verifiedBody}</p>
            <p className="tile-source">{locale === 'bn' ? 'etradelicense.gov.bd · যাচাই ১ নভেম্বর ২০২৬' : 'etradelicense.gov.bd · checked 1 Nov 2026'}</p>
          </article>
          <article className="tile">
            <span className="status status--dated">{t.datedSource}</span>
            <h3>{locale === 'bn' ? 'ফি পরিশোধ করুন' : 'Pay the fee'}</h3>
            <p>{t.datedBody}</p>
            <p className="tile-source">{locale === 'bn' ? 'etradelicense.gov.bd · প্রকাশিত ২০১৭' : 'etradelicense.gov.bd · published 2017'}</p>
          </article>
          <article className="tile">
            <span className="status status--confirm">{t.confirm}</span>
            <h3>{locale === 'bn' ? 'TIN সার্টিফিকেট' : 'TIN certificate'}</h3>
            <p>{t.confirmBody}</p>
            <p className="tile-source">{locale === 'bn' ? 'nbr.gov.bd · অফিসে নিশ্চিত করুন' : 'nbr.gov.bd · confirm at office'}</p>
          </article>
        </div>
      </section>

      <section className="container section section--tight" aria-labelledby="how-title">
        <div className="section-head">
          <h2 id="how-title">{t.howTitle}</h2>
        </div>
        <div className="kraft-strip">
          <article className="how-tile">
            <div className="how-tile-head">
              <span className="how-tile-num">1</span>
              <span className="how-tile-title">{t.how1}</span>
            </div>
            <p className="how-tile-body">{t.how1b}</p>
            <div className="mini-question" aria-hidden="true">
              <span className="mini-chip">{locale === 'bn' ? 'খাদ্য' : 'Food'}</span>
              <span className="mini-chip">{locale === 'bn' ? 'পণ্য' : 'Retail'}</span>
              <span className="mini-chip">{locale === 'bn' ? 'সেবা' : 'Service'}</span>
            </div>
          </article>
          <article className="how-tile">
            <div className="how-tile-head">
              <span className="how-tile-num">2</span>
              <span className="how-tile-title">{t.how2}</span>
            </div>
            <p className="how-tile-body">{t.how2b}</p>
            <div className="mini-roadmap" aria-hidden="true">
              <div className="mini-row">
                <span className="mini-num">01</span>
                <span className="mini-title">{locale === 'bn' ? 'কোন অফিস' : 'Which office'}</span>
                <span className="mini-status mini-status--dated">{locale === 'bn' ? 'পুরোনো' : 'Dated'}</span>
              </div>
              <div className="mini-row">
                <span className="mini-num">02</span>
                <span className="mini-title">{locale === 'bn' ? 'কাগজপত্র' : 'Documents'}</span>
                <span className="mini-status mini-status--dated">{locale === 'bn' ? 'পুরোনো' : 'Dated'}</span>
              </div>
              <div className="mini-row">
                <span className="mini-num">05</span>
                <span className="mini-title">{locale === 'bn' ? 'ফি' : 'Fee'}</span>
                <span className="mini-status mini-status--dated">{locale === 'bn' ? 'পরিসর' : 'Range'}</span>
              </div>
            </div>
          </article>
          <article className="how-tile">
            <div className="how-tile-head">
              <span className="how-tile-num">3</span>
              <span className="how-tile-title">{t.how3}</span>
            </div>
            <p className="how-tile-body">{t.how3b}</p>
            <div className="mini-checks" aria-hidden="true">
              <div className="mini-check">
                <span className="mini-check-mark">✓</span>
                <span>{locale === 'bn' ? 'ট্রেড লাইসেন্স পথ' : 'Trade licence path'}</span>
              </div>
              <div className="mini-check">
                <span className="mini-check-mark">✓</span>
                <span>{locale === 'bn' ? 'রিমাইন্ডার রাখুন' : 'Keep reminders'}</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="container section" aria-labelledby="sellers-title">
        <div className="split">
          <div className="photo" data-slot>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Cloth-roll.jpg/1280px-Cloth-roll.jpg"
              alt={locale === 'bn' ? 'পাশাপাশি সাজানো হস্তনির্মিত স্ট্রাইপ ও চেক কটনের রোল' : 'Rolls of handwoven striped and checked cotton stacked side by side'}
              width={1280}
              height={960}
              loading="lazy"
            />
          </div>
          <div className="split-copy">
            <h2 id="sellers-title">{t.sellersTitle}</h2>
            <p>{t.sellersBody}</p>
            <p>{t.sellersBody2}</p>
            <a href="/path" className="link">
              {t.startAnswers}
            </a>
          </div>
        </div>
      </section>

      <section className="container section" aria-labelledby="step-title">
        <div className="section-head">
          <h2 id="step-title">{t.stepTitle}</h2>
          <p>{t.stepBody}</p>
        </div>
        <div className="excerpt">
          <div className="split-copy">
            <h3>{t.feeTitle}</h3>
            <p>{t.feeBody}</p>
            <ul className="doc-list">
              <li>
                <span>{t.nid}</span>
                <span className="status status--dated">{t.datedSource}</span>
              </li>
              <li>
                <span>{t.rent}</span>
                <span className="status status--dated">{t.datedSource}</span>
              </li>
              <li>
                <span>{t.holding}</span>
                <span className="status status--dated">{t.datedSource}</span>
              </li>
            </ul>
          </div>
          <div className="fact">
            <span className="fee-tag">{t.factValue}</span>
            <span className="label">{t.factRange}</span>
            <span className="status status--dated">{t.datedSource}</span>
            <span className="label">{t.checked}</span>
          </div>
        </div>
      </section>

      <section className="loud" aria-labelledby="scam-title">
        <div className="container">
          <h2 id="scam-title">{t.scamTitle}</h2>
          <p>{t.scamBody}</p>
          <p style={{ marginTop: 'var(--space-lg)' }}>
            <a href="/scam-shield" className="btn btn--primary">
              {t.readScam}
            </a>
          </p>
        </div>
      </section>

      <section className="container section" aria-labelledby="ask-title">
        <div className="split split--flip">
          <div className="photo" data-slot>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Young_businesswoman_holding_her_smartphone_in_the_home_office.jpg/1280px-Young_businesswoman_holding_her_smartphone_in_the_home_office.jpg"
              alt={locale === 'bn' ? 'একটি বাসার ডেস্কে খোলা নোটবুক ও ল্যাপটপের ওপর ফোন ধরা হাত' : 'A hand holding a phone over an open notebook and laptop on a home desk'}
              width={1280}
              height={854}
              loading="lazy"
            />
          </div>
          <div className="split-copy">
            <h2 id="ask-title">{t.askTitle}</h2>
            <p>{t.askBody}</p>
            <div className="ask-block">
              <p className="ask-q">{t.askQ}</p>
              <p className="ask-a">{t.askA}</p>
            </div>
            <a href="/api/ask" className="link">
              {t.askLink}
            </a>
          </div>
        </div>
      </section>

      <div className="container">
        <p className="label" style={{ paddingBottom: 'var(--space-xl)' }}>
          {t.photos}{' '}
          <a className="link" href="https://commons.wikimedia.org/wiki/File:Cloth-roll.jpg">
            Samanthafara
          </a>{' '}
          (CC BY-SA 4.0) and{' '}
          <a
            className="link"
            href="https://commons.wikimedia.org/wiki/File:Young_businesswoman_holding_her_smartphone_in_the_home_office.jpg"
          >
            Shixart1985
          </a>{' '}
          (CC BY 2.0), via Wikimedia Commons.
        </p>
      </div>
    </>
  )
}
