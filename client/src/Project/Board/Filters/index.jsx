import React from 'react';
import PropTypes from 'prop-types';
import { xor } from 'lodash';

import { Select, Icon } from 'shared/components';
import { IssueSort, IssueSortCopy } from 'shared/constants/issues';

import {
  Filters,
  SearchInput,
  Avatars,
  AvatarIsActiveBorder,
  StyledAvatar,
  StyledButton,
  ClearAll,
  SelectItem,
} from './Styles';

const propTypes = {
  projectUsers: PropTypes.array.isRequired,
  defaultFilters: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  mergeFilters: PropTypes.func.isRequired,
};

const ProjectBoardFilters = ({ projectUsers, defaultFilters, filters, mergeFilters }) => {
  const { searchTerm, userIds, myOnly, recent, sort } = filters;

  const areFiltersCleared =
    !searchTerm && userIds.length === 0 && !myOnly && !recent && sort === null;
  const sortOptions = Object.values(IssueSort).map(value => ({
    value,
    label: IssueSortCopy[value],
  }));

  return (
    <Filters data-testid="board-filters">
      <SearchInput
        icon="search"
        value={searchTerm}
        onChange={value => mergeFilters({ searchTerm: value })}
      />
      <Avatars>
        {projectUsers.map(user => (
          <AvatarIsActiveBorder key={user.id} isActive={userIds.includes(user.id)}>
            <StyledAvatar
              avatarUrl={user.avatarUrl}
              name={user.name}
              onClick={() => mergeFilters({ userIds: xor(userIds, [user.id]) })}
            />
          </AvatarIsActiveBorder>
        ))}
      </Avatars>
      <StyledButton
        variant="empty"
        isActive={myOnly}
        onClick={() => mergeFilters({ myOnly: !myOnly })}
      >
        Only My Issues
      </StyledButton>
      <StyledButton
        variant="empty"
        isActive={recent}
        onClick={() => mergeFilters({ recent: !recent })}
      >
        Recently Updated
      </StyledButton>
      <Select
        name="sort"
        variant="empty"
        placeholder={
          <SelectItem>
            Sort Issues <Icon type="chevron-down" left={3} />
          </SelectItem>
        }
        dropdownWidth={200}
        value={sort}
        options={sortOptions}
        onChange={sortValue => {
          mergeFilters({ sort: sortValue });
        }}
        renderValue={e => renderSortItem(e.value, true, true)}
        renderOption={e => renderSortItem(e.value)}
      />
      {!areFiltersCleared && (
        <ClearAll onClick={() => mergeFilters(defaultFilters)}>Clear all</ClearAll>
      )}
    </Filters>
  );
};

const renderSortItem = (value, isActive, isSelectValue) => (
  <SelectItem key={value} isActive={isActive} isSelectValue={isSelectValue}>
    {IssueSortCopy[value]}
    {isSelectValue && <Icon type="chevron-down" left={3} />}
  </SelectItem>
);

ProjectBoardFilters.propTypes = propTypes;

export default ProjectBoardFilters;
