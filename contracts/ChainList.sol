pragma solidity ^0.8.0;
import "./Ownable.sol";
contract ChainList is Ownable {
    struct Article {
        uint256 id;
        address payable seller;
        address buyer;
        string name;
        string description;
        uint256 price;
    }

    mapping(uint256 => Article) public articles;
    uint256 articleCounter;


    constructor() {
        owner = payable(msg.sender);
    }

    function kill() public onlyOwner {
        require(owner == msg.sender);
        selfdestruct(owner);
    }

    event LogSellArticle(
        uint256 indexed _id,
        address indexed _seller,
        string _name,
        uint256 _price,
        string _description
    );
    event LogBuyArticle(
        uint256 indexed _id,
        address indexed _seller,
        address indexed _buyer,
        string _name,
        uint256 _price,
        string _description
    );

    function sellArticle(
        string memory _name,
        string memory _description,
        uint256 _price
    ) public {
        articleCounter++;
        articles[articleCounter] = Article(
            articleCounter,
            payable(msg.sender),
            address(0),
            _name,
            _description,
            _price
        );

        emit LogSellArticle(
            articleCounter,
            msg.sender,
            _name,
            _price,
            _description
        );
    }

    function getArticlesForSale() public view returns (uint256[] memory) {
        if (articleCounter == 0) {
            return new uint256[](0);
        }
        uint256[] memory articleIds = new uint256[](articleCounter);
        uint256 numberOfArticleForSale = 0;
        for (uint256 i = 1; i <= articleCounter; i++) {
            if (articles[i].buyer == address(0)) {
                articleIds[numberOfArticleForSale] = articles[i].id;
                numberOfArticleForSale++;
            }
        }
        uint256[] memory forSale = new uint256[](numberOfArticleForSale);
        for (uint256 j = 0; j < numberOfArticleForSale; j++) {
            forSale[j] = articleIds[j];
        }
        return forSale;
    }

    function buyArticle(uint256 _id) public payable {
        require(_id > 0 && _id <= articleCounter);
        Article storage article = articles[_id];
        require(article.seller != address(0));
        require(article.buyer == address(0));
        require(msg.sender != article.seller);
        require(msg.value == article.price);
        article.buyer = msg.sender;
        article.seller.transfer(msg.value);
        emit LogBuyArticle(
            article.id,
            article.seller,
            article.buyer,
            article.name,
            article.price,
            article.description
        );
    }

    function getNumberOfArticles() public view returns (uint256) {
        return articleCounter;
    }
}
