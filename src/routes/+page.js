const myTree = {
    name: "shanfan",
    children: [
        {
            name: "social",
            children: [{
                name: "bluesky",
                url: "https://bsky.app/profile/shanfan.bsky.social"
            }, {
                name: "instagram",
                url: "https://www.instagram.com/shanfan.huang"
            }, {
                name: "linkedin",
                url: "https://www.linkedin.com/in/shanfan-huang/"
            }]
        }, {
            name: "creative",
            children: [{
                name: "newsletter",
                url: "https://picturetextandnumbers.substack.com"
            }, {
                name: "behance",
                url: "https://www.behance.net/shanfanhuang"
            }, {
                name: "github",
                url: "https://shanfan.github.io/"
            }, {
                name: "pictxtnum",
                children: []
            }]
        }, {
            name: ""
        }
    ]
}

export function load() {
    return myTree;
};
