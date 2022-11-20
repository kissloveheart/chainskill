const { assert } = require("chai");

var ChainList = artifacts.require("./ChainList.sol");

contract("ChainList", function ([address1, address2]) {
  let chainList;
  let seller = address1;
  let buyer = address2;
  let articleName = "articleNmae 1";
  let articleId = 1;
  let articleDescription = "Description for article 1";
  let articlePrice = web3.utils.toBN(10);
  let sellerBalanceBeforeBuy, sellerBalanceAfterBuy;
  let buyerBalanceBeforeBuy, buyerBalanceAfterBuy;

  before(async () => {
    chainList = await ChainList.deployed();
  });

  describe("check exception buy article", () => {
    it("should throw an exception of you try to buy an article when there is no article for sale", async () => {
      try {
        const data = await chainList.buyArticle({
          from: buyer,
          value: web3.utils.toWei(articlePrice, "ether"),
        });
        assert.fail();
      } catch (error) {
        assert(true);
      }
      const numberOfArticles = await chainList.getNumberOfArticles();

      assert.equal(
        numberOfArticles.toNumber(),
        0,
        "number of articles must be zero"
      );
    });

    it("should throw an exception if you try to buy your own article", async () => {
      const receipt = await chainList.sellArticle(
        articleName,
        articleDescription,
        web3.utils.toWei(articlePrice, "ether"),
        { from: seller }
      );

      try {
        await chainList.buyArticle({
          from: seller,
          value: web3.utils.toWei(articlePrice, "ether"),
        });
        assert.fail();
      } catch (error) {
        assert(true);
      }

      const article = await chainList.articles(articleId);
      assert.equal(
        article[0].toNumber(),
        articleId,
        "article id must be " + articleId
      );
      assert.equal(article[1], seller, "seller must be " + seller);
      assert.equal(article[2], 0x0, "buyer must be empty");
      assert.equal(
        article[3],
        articleName,
        "article name must be " + articleName
      );
      assert.equal(
        article[4],
        articleDescription,
        "article description must be " + articleDescription
      );
      assert.equal(
        article[5].toString(),
        web3.utils.toWei(articlePrice, "ether").toString(),
        "article price must be " + web3.utils.toWei(articlePrice, "ether")
      );
    });

    it("should throw an exception if you try to buy article with different file of article", async () => {
      try {
        await chainList.buyArticle({
          from: buyer,
          value: web3.utils.toWei(web3.utils.toBN(11), "ether"),
        });
      } catch (error) {
        assert(true);
      }

      const article = await chainList.articles(articleId);
      //make sure sure the contract state was not altered
      assert.equal(
        article[0].toNumber(),
        articleId,
        "article id must be " + articleId
      );
      assert.equal(article[1], seller, "seller must be " + seller);
      assert.equal(article[2], 0x0, "buyer must be empty");
      assert.equal(
        article[3],
        articleName,
        "article name must be " + articleName
      );
      assert.equal(
        article[4],
        articleDescription,
        "article description must be " + articleDescription
      );
      assert.equal(
        article[5].toString(),
        web3.utils.toWei(articlePrice, "ether").toString(),
        "article price must be " + web3.utils.toWei(articlePrice, "ether")
      );
    });

    it("should throw an exception if you try to buy article already sold", async () => {
      try {
        await chainList.buyArticle({
          from: buyer,
          value: web3.utils.toWei(articlePrice, "ether"),
        });

        await chainList.buyArticle({
          from: buyer,
          value: web3.utils.toWei(articlePrice, "ether"),
        });
      } catch (error) {
        assert(true);
      }

      const article = await chainList.articles(articleId);
      //make sure sure the contract state was not altered
      assert.equal(
        article[0].toNumber(),
        articleId,
        "article id must be " + articleId
      );
      assert.equal(article[1], seller, "seller must be " + seller);
      assert.equal(article[2], 0x0, "buyer must be empty");
      assert.equal(
        article[3],
        articleName,
        "article name must be " + articleName
      );
      assert.equal(
        article[4],
        articleDescription,
        "article description must be " + articleDescription
      );
      assert.equal(
        article[5].toString(),
        web3.utils.toWei(articlePrice, "ether").toString(),
        "article price must be " + web3.utils.toWei(articlePrice, "ether")
      );
    });
  });
});
