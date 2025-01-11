import PropTypes from 'prop-types';
export function SearchHeader({ count, children }) {
  return (
    <div className="flex justify-between mt-14 mx-5">
      <h3 className="capitalize text-lg lg:text-xl font-semibold text-center flex items-center">
        Search Results ({count})
      </h3>
      {children}
    </div>
  );
}

SearchHeader.propTypes = {
  count: PropTypes.number,
  children: PropTypes.node,
};