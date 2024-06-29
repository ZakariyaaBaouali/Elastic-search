import { Client } from "@elastic/elasticsearch";
import { faker } from "@faker-js/faker";

//blog
interface IBlog {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  price: number;
}

//
export class SearchEngine {
  private readonly client;
  private count: number;

  //
  constructor(count: number) {
    this.client = new Client({
      node: "http://localhost:9200",
    });
    this.client
      .info()
      .then(() => console.log("Connect to elastic search"))
      .catch(() => console.log("Failed to connect to elatsic search"));
    this.count = count;
  }

  //create index == DB
  public async createIndex() {
    //create index db
    await this.client.indices.create({
      index: "products_index",
    });
    console.log("index / db created");

    for (let i = 0; i < this.count; i++) {
      const blog: IBlog = {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price()),
        createdAt: faker.date.past(),
      };

      console.log(`blog id : ${blog.id}`);

      //create document
      await this.client.index({
        index: "products_index",
        id: blog.id,
        document: {
          name: blog.name,
          description: blog.description,
        },
      });
    }
  }

  //get doc by id
  public async getIndexDocument(doc_id: string) {
    const data = await this.client.get({
      index: "products_index",
      id: doc_id,
    });
    return data;
  }

  //get all
  public async searchAll() {
    const data = await this.client.search({
      index: "products_index",
      query: {
        match_all: {},
      },
    });
    return data.hits.hits;
  }

  //search by name
  public async searchProductByName(searched_name: string) {
    //full text search
    const data = await this.client.search({
      index: "products_index",
      query: {
        match: {
          name: {
            query: searched_name,
          },
        },
      },
    });
    return data.hits.hits;
  }

  //auto complete products by names -> partial text
  public async autoComplete(in_complete_name: string) {
    //partial text
    const data = await this.client.search({
      index: "products_index",
      query: {
        wildcard: {
          name: `*${in_complete_name}*`,
        },
      },
    });
    return data.hits.hits;
  }

  //multiple search name + description
  public async multiSearch(find_text: string) {
    //multi- text
    const data = await this.client.search({
      index: "products_index",
      query: {
        multi_match: {
          query: find_text,
          fields: ["name", "description"],
        },
      },
    });
    return data.hits.hits;
  }
}
