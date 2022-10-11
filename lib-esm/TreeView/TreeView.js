import { ChevronDownIcon, ChevronRightIcon, FileDirectoryOpenFillIcon, FileDirectoryFillIcon } from '@primer/octicons-react';
import { useSSRSafeId } from '@react-aria/ssr';
import React from 'react';
import styled from 'styled-components';
import Box from '../Box.js';
import { useControllableState } from '../hooks/useControllableState.js';
import StyledSpinner from '../Spinner.js';
import StyledOcticon from '../StyledOcticon.js';
import sx from '../sx.js';
import Text from '../Text.js';
import createSlots from '../utils/create-slots.js';
import { useActiveDescendant } from './useActiveDescendant.js';
import { useTypeahead } from './useTypeahead.js';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// Context

const RootContext = /*#__PURE__*/React.createContext({
  activeDescendant: ''
});
const ItemContext = /*#__PURE__*/React.createContext({
  level: 1,
  isExpanded: false,
  expandParents: () => {}
}); // ----------------------------------------------------------------------------
// TreeView

const UlBox = styled.ul.withConfig({
  displayName: "TreeView__UlBox",
  componentId: "sc-4ex6b6-0"
})(sx);

const Root = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  children
}) => {
  const containerRef = React.useRef(null);
  const [activeDescendant, setActiveDescendant] = useActiveDescendant({
    containerRef
  });
  useTypeahead({
    containerRef,
    onFocusChange: element => setActiveDescendant(element.id)
  });
  return /*#__PURE__*/React.createElement(RootContext.Provider, {
    value: {
      activeDescendant,
      setActiveDescendant
    }
  }, /*#__PURE__*/React.createElement(UlBox, {
    ref: containerRef,
    tabIndex: 0,
    role: "tree",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-activedescendant": activeDescendant,
    sx: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      // We'll display a focus ring around the active descendant
      // instead of the tree itself
      outline: 0
    }
  }, children));
};

Root.displayName = "Root";
const {
  Slots,
  Slot
} = createSlots(['LeadingVisual', 'TrailingVisual']);

const Item = ({
  current: isCurrentItem = false,
  defaultExpanded = false,
  expanded,
  onExpandedChange,
  onSelect,
  children
}) => {
  const {
    setActiveDescendant
  } = React.useContext(RootContext);
  const itemId = useSSRSafeId();
  const labelId = useSSRSafeId();
  const itemRef = React.useRef(null);
  const [isExpanded, setIsExpanded] = useControllableState({
    name: itemId,
    defaultValue: defaultExpanded,
    value: expanded,
    onChange: onExpandedChange
  });
  const {
    level,
    expandParents
  } = React.useContext(ItemContext);
  const {
    hasSubTree,
    subTree,
    childrenWithoutSubTree
  } = useSubTree(children); // Expand or collapse the subtree

  const toggle = React.useCallback(event => {
    setIsExpanded(!isExpanded);
    event === null || event === void 0 ? void 0 : event.stopPropagation();
  }, // setIsExpanded is stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [isExpanded]); // Expand all parents of this item including itself

  const expandParentsAndSelf = React.useCallback(() => {
    expandParents();
    setIsExpanded(true);
  }, // setIsExpanded is stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [expandParents]); // If this item is the current item, expand it and all its parents

  React.useLayoutEffect(() => {
    if (isCurrentItem) {
      expandParentsAndSelf();
    }
  }, [isCurrentItem, expandParentsAndSelf]);
  React.useEffect(() => {
    const element = itemRef.current;

    function handleKeyDown(event) {
      // WARNING: Removing this line will cause an infinite loop!
      // The root element receives all keyboard events and forwards them
      // to the active descendant. If we don't stop propagation here,
      // the event will bubble back up to the root element and be forwarded
      // back to the active descendant infinitely.
      event.stopPropagation();

      switch (event.key) {
        case 'Enter':
          if (onSelect) {
            onSelect(event);
          } else {
            toggle();
          }

          break;

        case 'ArrowRight':
          if (!isExpanded) toggle();
          break;

        case 'ArrowLeft':
          if (isExpanded) toggle();
          break;
      }
    }

    element === null || element === void 0 ? void 0 : element.addEventListener('keydown', handleKeyDown);
    return () => element === null || element === void 0 ? void 0 : element.removeEventListener('keydown', handleKeyDown);
  }, [toggle, onSelect, isExpanded]);
  return /*#__PURE__*/React.createElement(ItemContext.Provider, {
    value: {
      level: level + 1,
      isExpanded,
      expandParents: expandParentsAndSelf
    }
  }, /*#__PURE__*/React.createElement("li", {
    id: itemId,
    ref: itemRef,
    role: "treeitem",
    "aria-labelledby": labelId,
    "aria-level": level,
    "aria-expanded": hasSubTree ? isExpanded : undefined,
    "aria-current": isCurrentItem ? 'true' : undefined
  }, /*#__PURE__*/React.createElement(Box, {
    onClick: event => {
      setActiveDescendant === null || setActiveDescendant === void 0 ? void 0 : setActiveDescendant(itemId);

      if (onSelect) {
        onSelect(event);
      } else {
        toggle(event);
      }
    },
    sx: {
      '--toggle-width': '1rem',
      // 16px
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: `calc(${level - 1} * (var(--toggle-width) / 2)) var(--toggle-width) 1fr`,
      gridTemplateAreas: `"spacer toggle content"`,
      width: '100%',
      height: '2rem',
      // 32px
      fontSize: 1,
      color: 'fg.default',
      borderRadius: 2,
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'actionListItem.default.hoverBg'
      },
      '@media (pointer: coarse)': {
        '--toggle-width': '1.5rem',
        // 24px
        height: '2.75rem' // 44px

      },
      // WARNING: styled-components v5.2 introduced a bug that changed
      // how it expands `&` in CSS selectors. The following selectors
      // are unnecessarily specific to work around that styled-components bug.
      // Reference issue: https://github.com/styled-components/styled-components/issues/3265
      [`[role=tree][aria-activedescendant="${itemId}"]:focus-visible #${itemId} > &:is(div)`]: {
        boxShadow: theme => `0 0 0 2px ${theme.colors.accent.emphasis}`
      },
      '[role=treeitem][aria-current=true] > &:is(div)': {
        bg: 'actionListItem.default.selectedBg',
        '&::after': {
          position: 'absolute',
          top: 'calc(50% - 12px)',
          left: -2,
          width: '4px',
          height: '24px',
          content: '""',
          bg: 'accent.fg',
          borderRadius: 2
        }
      }
    }
  }, /*#__PURE__*/React.createElement(Box, {
    sx: {
      gridArea: 'spacer',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(LevelIndicatorLines, {
    level: level
  })), hasSubTree ? /*#__PURE__*/React.createElement(Box, {
    onClick: event => {
      if (onSelect) {
        setActiveDescendant === null || setActiveDescendant === void 0 ? void 0 : setActiveDescendant(itemId);
        toggle(event);
      }
    },
    sx: {
      gridArea: 'toggle',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: 'fg.muted',
      borderTopLeftRadius: level === 1 ? 2 : 0,
      borderBottomLeftRadius: level === 1 ? 2 : 0,
      '&:hover': {
        backgroundColor: onSelect ? 'actionListItem.default.hoverBg' : null
      }
    }
  }, isExpanded ? /*#__PURE__*/React.createElement(ChevronDownIcon, null) : /*#__PURE__*/React.createElement(ChevronRightIcon, null)) : null, /*#__PURE__*/React.createElement(Box, {
    id: labelId,
    sx: {
      gridArea: 'content',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      px: 2,
      gap: 2
    }
  }, /*#__PURE__*/React.createElement(Slots, null, slots => /*#__PURE__*/React.createElement(React.Fragment, null, slots.LeadingVisual, /*#__PURE__*/React.createElement(Text, {
    sx: {
      // Truncate text label
      flex: '1 1 auto',
      width: 0,
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    }
  }, childrenWithoutSubTree), slots.TrailingVisual)))), subTree));
};

Item.displayName = "Item";

/** Lines to indicate the depth of an item in a TreeView */
const LevelIndicatorLines = ({
  level
}) => {
  return /*#__PURE__*/React.createElement(Box, {
    sx: {
      width: '100%',
      display: 'flex'
    }
  }, Array.from({
    length: level - 1
  }).map((_, index) => /*#__PURE__*/React.createElement(Box, {
    key: index,
    sx: {
      width: '100%',
      height: '100%',
      borderRight: '1px solid',
      // On devices without hover, the nesting indicator lines
      // appear at all times.
      borderColor: 'border.subtle',
      // On devices with :hover support, the nesting indicator lines
      // fade in when the user mouses over the entire component,
      // or when there's focus inside the component. This makes
      // sure the component remains simple when not in use.
      '@media (hover: hover)': {
        borderColor: 'transparent',
        '[role=tree]:hover &, [role=tree]:focus &': {
          borderColor: 'border.subtle'
        }
      }
    }
  })));
};

LevelIndicatorLines.displayName = "LevelIndicatorLines";

// TODO: Use an <a> element to enable native browser behavior like opening links in a new tab
const LinkItem = ({
  href,
  onSelect,
  ...props
}) => {
  return /*#__PURE__*/React.createElement(Item, _extends({
    onSelect: event => {
      window.open(href, '_self');
      onSelect === null || onSelect === void 0 ? void 0 : onSelect(event);
    }
  }, props));
};

LinkItem.displayName = "LinkItem";

// ----------------------------------------------------------------------------
// TreeView.LoadingItem
const LoadingItem = () => {
  return (
    /*#__PURE__*/
    // TODO: What aria attributes do we need to add here?
    React.createElement(Item, null, /*#__PURE__*/React.createElement(LeadingVisual, null, /*#__PURE__*/React.createElement(StyledSpinner, {
      size: "small"
    })), /*#__PURE__*/React.createElement(Text, {
      sx: {
        color: 'fg.muted'
      }
    }, "Loading..."))
  );
};

LoadingItem.displayName = "LoadingItem";
LoadingItem.displayName = 'TreeView.LoadingItem'; // ----------------------------------------------------------------------------
// TreeView.SubTree

const SubTree = ({
  children
}) => {
  const {
    isExpanded
  } = React.useContext(ItemContext);
  return /*#__PURE__*/React.createElement(Box, {
    as: "ul",
    role: "group",
    hidden: !isExpanded,
    sx: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    }
  }, children);
};

SubTree.displayName = "SubTree";

function useSubTree(children) {
  return React.useMemo(() => {
    const subTree = React.Children.toArray(children).find(child => /*#__PURE__*/React.isValidElement(child) && child.type === SubTree);
    const childrenWithoutSubTree = React.Children.toArray(children).filter(child => !( /*#__PURE__*/React.isValidElement(child) && child.type === SubTree));
    return {
      subTree,
      childrenWithoutSubTree,
      hasSubTree: Boolean(subTree)
    };
  }, [children]);
} // ----------------------------------------------------------------------------
// TreeView.LeadingVisual and TreeView.TrailingVisual


const LeadingVisual = props => {
  const {
    isExpanded
  } = React.useContext(ItemContext);
  const children = typeof props.children === 'function' ? props.children({
    isExpanded
  }) : props.children;
  return /*#__PURE__*/React.createElement(Slot, {
    name: "LeadingVisual"
  }, /*#__PURE__*/React.createElement(Box, {
    sx: {
      display: 'flex',
      color: 'fg.muted'
    }
  }, children));
};

LeadingVisual.displayName = "LeadingVisual";

const TrailingVisual = props => {
  const {
    isExpanded
  } = React.useContext(ItemContext);
  const children = typeof props.children === 'function' ? props.children({
    isExpanded
  }) : props.children;
  return /*#__PURE__*/React.createElement(Slot, {
    name: "TrailingVisual"
  }, /*#__PURE__*/React.createElement(Box, {
    sx: {
      display: 'flex',
      color: 'fg.muted'
    }
  }, children));
};

TrailingVisual.displayName = "TrailingVisual";

// ----------------------------------------------------------------------------
// TreeView.DirectoryIcon
const DirectoryIcon = () => {
  const {
    isExpanded
  } = React.useContext(ItemContext);
  const icon = isExpanded ? FileDirectoryOpenFillIcon : FileDirectoryFillIcon; // TODO: Use correct color

  return /*#__PURE__*/React.createElement(StyledOcticon, {
    icon: icon
  });
};

DirectoryIcon.displayName = "DirectoryIcon";
// ----------------------------------------------------------------------------
// Export
const TreeView = Object.assign(Root, {
  Item,
  LinkItem,
  LoadingItem,
  SubTree,
  LeadingVisual,
  TrailingVisual,
  DirectoryIcon
});

export { TreeView };
