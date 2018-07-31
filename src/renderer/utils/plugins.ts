import React from 'react';
import styled from 'styled-components';
import wpm from 'wexond-package-manager';
import components from '../components';
import colors from '../defaults/colors';
import opacity from '../defaults/opacity';

export const loadPlugins = async () => {
  const plugins = await wpm.list();

  for (const plugin of plugins) {
    const mock = {
      fs: {},
      react: React,
      'styled-components': styled,
      wexond: {
        colors,
        opacity,
      },
      'wexond-components': {
        tabStyles: components.tab,
      },
    };

    const { context } = await wpm.run(plugin.namespace, {}, mock);

    const pluginAPI = context.exports;

    for (const key in components) {
      if (pluginAPI[key] && components[key]) {
        components[key] = { ...components[key], ...pluginAPI[key] };
      }
    }
    wpm.update(plugin.namespace, false);
  }
};
