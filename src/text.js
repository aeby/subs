(function () {
    var canvas = document.getElementById('n'),
        links = document.querySelectorAll('a'),
        l,
        ctx = canvas.getContext('2d'),
        ro = Math.round,
        ra = Math.random,
        start = Date.now(),
        end = 0,
        blockSize,
        blockSizeHalf,
        fragments,
        triangles = {r: [], a: []},
        colors = [
            [
                [100, 39, 44], [218, 31, 38], [250, 170, 31], [224, 107, 28], [147, 27, 37], [246, 183, 18],
                [185, 72, 42], [249, 107, 25], [133, 30, 31], [245, 139, 30]
            ],
            [
                [79, 166, 71], [71, 152, 72], [81, 158, 79], [132, 128, 46], [191, 152, 47], [34, 149, 40],
                [89, 98, 43], [160, 194, 58], [13, 70, 38], [218, 233, 150]
            ],
            [
                [75, 175, 141], [157, 191, 164], [73, 191, 221], [47, 172, 166], [26, 76, 87], [129, 199, 175],
                [22, 145, 163], [37, 180, 238], [17, 92, 113]
            ]
        ],
        re = [
            [[6, 15, 15], [15, 6, 9], [15, 3, 9]],
            [[6, 15, 12], [15, 6, 9], [3, 15, 12]],
            [[15, 15, 9], [0, 6, 0], [0, 15, 0]],
            [[6, 15, 12], [15, 0, 15], [3, 15, 9]]
        ],
        ae = [
            [[0, 6, 12, 0], [6, 9, 3, 12], [15, 3, 9, 15]],
            [[6, 15, 12], [15, 6, 9], [3, 15, 12]],
            [[15, 0, 0], [15, 3, 12], [3, 15, 9]],
            [[6, 15, 12], [15, 6, 9], [3, 15, 12]],
            [[6, 15, 15], [15, 6, 9], [15, 3, 9]],
            [[6, 15, 9], [15, 6, 12], [3, 9, 9]],
            [[6, 15, 12], [15, 0, 15], [3, 15, 9]],
            [[6], [15], [15]],
            [[0, 0, 15], [6, 9, 15], [3, 15, 9]]
        ];

    function color(palette) {
        var c = colors[palette][ro(ra() * (colors[palette].length - 1))];
        return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ', 0.94)';
    }

    function text(t, yOff, triangleData) {
        var letterOffset = 0, colorRun = 0, palette = 0, triangleIndex = 0, row = 0;
        t.forEach(function (letter) {
            letter.forEach(function (line, lineIndex) {
                line.forEach(function (block, blockIndex) {
                    var xOffset = letterOffset + blockIndex * blockSize,
                        yOffset = yOff + lineIndex * blockSize;
                    fragments.forEach(function (fragment, fragmentIndex) {
                        if (1 & block >> fragmentIndex) {
                            var rgb, delay;
                            if (triangleData[triangleIndex]) {
                                rgb = triangleData[triangleIndex][0];
                                delay = triangleData[triangleIndex][1];

                            } else {
                                if (!colorRun) {
                                    colorRun = 5 + ro(ra() * 14);
                                    palette = ro(ra() * 2);
                                }
                                rgb = color(palette);
                                delay = row * 16 + ra() * 233;
                                end = Math.max(end, delay);
                                triangleData.push([rgb, delay]);
                                colorRun--;
                            }

                            if (Date.now() - start > delay) {
                                ctx.fillStyle = ctx.strokeStyle = rgb;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(xOffset + fragment[0], yOffset + fragment[1]);
                                ctx.lineTo(xOffset + blockSizeHalf, yOffset + blockSizeHalf);
                                ctx.lineTo(xOffset + fragments[(fragmentIndex + 1) % 4][0],
                                    yOffset + fragments[(fragmentIndex + 1) % 4][1]);
                                ctx.fill();
                                ctx.stroke();
                            }

                            triangleIndex++;
                        }
                    });
                    row++;
                });
            });
            letterOffset += letter[0].length * blockSize + blockSizeHalf;
        });
    }

    function draw() {
        var bs = ro(window.innerWidth * 0.77 / 30.0), nbs = bs % 2 ? bs + 1 : bs;
        if (nbs !== blockSize || Date.now() - start < end + 32) {
            blockSize = nbs;
            blockSizeHalf = blockSize * 0.5;
            fragments = [[0, 0], [blockSize, 0], [blockSize, blockSize], [0, blockSize]];
            canvas.width = blockSize * 30;
            canvas.height = blockSize * 7;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            text(re, 0, triangles.r);
            text(ae, blockSize * 4, triangles.a);
        }
        window.requestAnimationFrame(draw);
    }

    window.requestAnimationFrame(draw);

    setTimeout(function () {
        for (l = 0; l < links.length; ++l) {
            links[l].classList.add('show');
        }
    }, 100);
})();
