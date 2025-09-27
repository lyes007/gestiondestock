export interface Article {
  id: number;
  inputCode: string;
  inputDesignation: string | null;
  articleId: string;
  articleNo: string;
  productName: string;
  hasMultiple: boolean;
  exists: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  supplierId: number;
  supplier: {
    id: number;
    name: string;
  };
  oemNumbers: {
    id: number;
    oemBrand: string;
    oemNumber: string;
  }[];
  productImage: {
    id: number;
    originalUrl: string;
    localPath: string;
    fileName: string;
    fileSize: number | null;
    mimeType: string | null;
  } | null;
}

export interface GroupedArticles {
  inputCode: string;
  articles: Article[];
}
