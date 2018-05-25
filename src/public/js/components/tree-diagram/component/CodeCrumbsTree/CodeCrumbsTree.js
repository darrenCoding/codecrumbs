import React from 'react';
import { withSvgDraw } from '../SvgDraw';
import {
    drawCodeCrumbEdge,
    drawPartEdge,
    drawCodeCrumbLoc
} from './drawHelpers';

import { FILE_NODE_TYPE, DIR_NODE_TYPE } from '../../store/constants';
import { getFilesList } from '../../../../utils/treeLayout';

class CodeCrumbsTree extends React.Component {
    componentDidMount() {
        this.drawTree();
    }

    componentDidUpdate() {
        const { primaryDraw } = this.props;

        primaryDraw.clear();
        this.drawTree();
    }

    drawTree() {
        const {
            primaryDraw,
            filesTreeLayoutNodes,
            shiftToCenterPoint,
            onCodeCrumbMouseOver
        } = this.props;

        const filesList = getFilesList(filesTreeLayoutNodes);
        filesList.forEach(node => {
            const [nX, nY] = [node.y, node.x];

            if (node.children) {
                drawPartEdge(primaryDraw, shiftToCenterPoint, {
                    source: {
                        x: nX,
                        y: nY
                    },
                    parentName: node.data.name
                });

                node.children.forEach((crumb, i, list) => {
                    const [cX, cY] = [crumb.y, crumb.x];
                    const singleCrumb = list.length === 1;

                    !singleCrumb &&
                        drawCodeCrumbEdge(primaryDraw, shiftToCenterPoint, {
                            source: {
                                x: nX,
                                y: nY
                            },
                            target: {
                                x: cX,
                                y: cY
                            },
                            parentName: node.data.name
                        });

                    const loc = crumb.data.crumbedLineNode.loc.start;
                    drawCodeCrumbLoc(primaryDraw, shiftToCenterPoint, {
                        x: cX,
                        y: cY,
                        loc: `(${loc.line},${loc.column})`,
                        name: crumb.data.name,
                        singleCrumb,
                        onMouseOver(position) {
                            onCodeCrumbMouseOver(node.data, position)
                        },
                        onClick() {
                            console.log(node.data.fileCode)
                        }
                    });
                });
            }
        });
    }

    render() {
        return null;
    }
}

export default withSvgDraw(CodeCrumbsTree);