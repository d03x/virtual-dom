class VDom {
    constructor(
        public tag: string,
        public props: Record<string, any>,
        public children: Array<VDom | string>,
    ) {

    }
    /**
     * render
     */
    public render(): HTMLElement | Text {
        const $Element = document.createElement(this.tag);

        for (const [key, value] of Object.entries(this.props)) {
            $Element.setAttribute(key, value);
        }
        //append child
        this.children.forEach(function (child: any) {
            let childEL = child instanceof VDom ? child.render() : document.createTextNode(child);
            $Element.appendChild(childEL);
        });
        return $Element;
    }
}

function diff(oldNode: VDom, newNode: VDom): boolean {
    if (oldNode.tag !== newNode.tag) {
        return true;
    }
    const oldProps = oldNode.props || {};
    const newProps = newNode.props || {};

    const propsChanged = Object.keys(newProps).some(key => newProps[key] != oldProps[key]);
    if (propsChanged) { return true };
    if (newNode.children.length != oldNode.children.length) return true;
    for (let i = 0; i < oldNode.children.length; i++) {
        const oldChild = oldNode.children[i];
        const newChild = newNode.children[i];
        if (typeof oldChild === 'string' || typeof newChild === 'string') {
            if (oldChild != newChild) {
                return true;
            }
        } else if (diff(oldChild as VDom, newChild as VDom)) {
            return true;
        }


    }
    return false;
}

function updateDOM(parent: HTMLElement, oldNode: VDom | null, newNode: VDom) {
    if (!oldNode) {
        parent.appendChild(newNode.render());
    } else if (!newNode) {
        parent.innerHTML = "";
    } else if (diff(oldNode, newNode)) {

        parent.replaceChild(newNode.render(), parent.firstChild as Node);
    }
}
let count = 0;
function createNode(): VDom {
    return new VDom("div", {
        class: "container",
    }, [
        new VDom("div", {
            class: "container",
        }, [
            `${count}`,
        ]),
        new VDom("div", {
            class: "container",
        }, [
            new VDom("button", {
                id : "button"
            }, ["Click"])
        ])
    ]);
};


const app = document.getElementById("app") as HTMLElement;
let oldNode: VDom = createNode();
function increment() {
    count = count +1;
    const newNode = createNode();
    updateDOM(app, oldNode, newNode);
    oldNode = newNode;
}
updateDOM(app, null, oldNode);

const buton : HTMLElement =document.getElementById("button") as HTMLElement;

buton.addEventListener("click",increment);