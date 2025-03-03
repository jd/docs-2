import { SimpleGrid } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';

import { LineNumbersContext } from '../chakra-helpers/CodeBlock';

export default function CodeColumns({ cols = 2, children }) {
  return (
    <LineNumbersContext.Provider value={false}>
      <SimpleGrid columns={cols} spacing="4">
        {children}
      </SimpleGrid>
    </LineNumbersContext.Provider>
  );
}

CodeColumns.propTypes = {
  cols: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.node.isRequired,
};
