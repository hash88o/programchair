module.exports = {
    plugins: [
        require('cssnano')({
            preset: ['default', {
                discardComments: {
                    removeAll: true,
                },
                minifyFontValues: true,
                minifySelectors: true,
            }],
        }),
    ],
}; 