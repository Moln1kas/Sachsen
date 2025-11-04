export default interface Blog {
  total: number,
  page: number,
  limit: number,
  blogs: [
    {
      id: number;
      title: string;
      text: string;
      isImportant: boolean;
      category: {
        id: number;
        title: string;
      }
      updatedAt: string;
    },
  ],
}