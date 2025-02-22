export type Bill = {
  act: string | null;
  amendmentLists: AmendmentList[];
  billNo: string;
  billType: string;
  billTypeURI: string;
  billYear: string;
  debates: Debate[];
  events: BillEvent[];
  lastUpdated: string;
  longTitleEn: string;
  longTitleGa: string;
  method: string;
  methodURI: string;
  mostRecentStage: MostRecentStage;
  originHouse: Chamber;
  originHouseURI: string;
  relatedDocs: RelatedDocument[];
  shortTitleEn: string;
  shortTitleGa: string;
  source: string;
  sourceURI: string;
  sponsors: Sponsor[];
  stages: Stage[];
  status: string;
  isFavorite?: boolean;
};

export type AmendmentList = {
  amendmentList: {
    amendmentTypeUri: URI;
    chamber: Chamber;
    date: string;
    formats: {
      pdf?: URI;
      xml?: URI | null;
    };
    showAs: string;
    stage: StageReference;
    stageNo: string;
  };
};

export type Debate = {
  chamber: Chamber;
  date: string;
  debateSectionId: string;
  showAs: string;
  uri: string;
};

export type BillEvent = {
  event: {
    chamber: Chamber;
    dates: { date: string }[];
    eventURI: string;
    showAs: string;
    uri: string;
  };
};

export type MostRecentStage = {
  event: {
    chamber: Chamber;
    dates: { date: string }[];
    house: House;
    progressStage: number;
    showAs: string;
    stageCompleted: boolean;
    stageOutcome: string | null;
    stageURI: string;
    uri: string;
  };
};

export type RelatedDocument = {
  relatedDoc: {
    date: string;
    docType: string;
    formats: {
      pdf?: URI;
      xml?: URI | null;
    };
    lang: string;
    showAs: string;
    uri: string;
  };
};

export type Sponsor = {
  sponsor: {
    as: {
      showAs: string;
      uri: string | null;
    };
    by: {
      showAs: string | null;
      uri: string | null;
    };
    isPrimary: boolean;
  };
};

export type Stage = {
  event: {
    chamber: Chamber;
    dates: { date: string }[];
    house: House;
    progressStage: number;
    showAs: string;
    stageCompleted: boolean;
    stageOutcome: string | null;
    stageURI: string;
    uri: string;
  };
};

export type StageReference = {
  showAs: string;
  uri: string;
};

export type Chamber = {
  showAs: string;
  uri: string;
};

export type House = {
  chamberCode: string;
  chamberType: string;
  houseCode: string;
  houseNo: string;
  showAs: string;
  uri: string;
};

export type URI = {
  uri: string;
};
export type BillsResponseHead = {
  counts: {
    billCount: number; 
    resultCount: number; 
  };
  dateRange: {
    start: string;
    end: string;
  };
  lang: string; 
};