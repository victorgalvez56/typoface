export type LanguageKey = 'Korean' | 'Japanese' | 'Arabic' | 'English' | 'Spanish' | 'Custom';

export const LANGUAGE_FLAGS: Record<LanguageKey, string> = {
  Korean:   '🇰🇷',
  Japanese: '🇯🇵',
  Arabic:   '🇸🇦',
  English:  '🇺🇸',
  Spanish:  '🇪🇸',
  Custom:   '✏️',
};

export const WORD_POOLS: Record<Exclude<LanguageKey, 'Custom'>, string[]> = {
  Korean: [
    '빛','그림자','시간','기억','공간','사랑','꿈','바람','하늘','마음',
    '소리','시작','끝','노래','색깔','현재','미래','과거','자연','예술',
    '감각','형태','흐름','리듬','파동','빛깔','감정','생각','눈물','웃음',
    '고요','움직임','변화','존재','언어','문자','이야기','세계','우주','별',
  ],
  Japanese: [
    '自然','時間','記憶','光','影','風','海','夢','空','心',
    '愛','花','声','詩','美','月','星','水','火','木',
    '山','川','道','人','命','音','色','形','波','流',
    'ひかり','かぜ','そら','うみ','ゆめ','こころ','はな','つき','ほし','みず',
  ],
  Arabic: [
    'أمل','نور','حياة','قلب','روح','سماء','بحر','شمس','قمر','نجوم',
    'حب','سلام','حرية','فن','إبداع','لون','صوت','زمن','ذاكرة','طبيعة',
    'موج','نهر','جبل','ريح','ضوء','ظل','شعر','موسيقى','رقص','حلم',
  ],
  English: [
    'love','dream','echo','light','shadow','pulse','flow','code','pixel','art',
    'form','space','time','mind','soul','wave','glow','rise','blur','shift',
    'fade','beam','haze','drift','spark','void','core','grid','loop','sync',
    'flux','veil','tone','arch','edge','mode','link','node','lens','base',
  ],
  Spanish: [
    'luz','sombra','tiempo','alma','mente','forma','color','ritmo','pulso','eco',
    'fluir','arte','código','pixel','onda','brillo','caos','orden','voz','sueño',
    'aire','mar','cielo','tierra','fuego','agua','vida','amor','paz','calma',
    'fuerza','gracia','danza','canto','verso','imagen','mirada','silencio','inicio','fin',
  ],
};

export function getWordPool(language: LanguageKey, customText: string): string[] {
  if (language === 'Custom') {
    const words = customText
      .split(/[\s,\n]+/)
      .map(w => w.trim())
      .filter(w => w.length > 0);
    return words.length > 0 ? words : WORD_POOLS.English;
  }
  return WORD_POOLS[language];
}
