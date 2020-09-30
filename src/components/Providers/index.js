import React, { useEffect, useMemo } from 'react';
import useFetch from 'hooks/fetch';
import { PROVIDERS } from 'modules/api/endpoints';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import ProfileCard from 'components/Providers/ProviderCard';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useSelector } from "react-redux";
import { selectActiveFilter } from "modules/app/selectors";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  item: {
    padding: '10px',
    [theme.breakpoints.up('sm')]: {
      flexBasis: '50%'
    },
    [theme.breakpoints.down('sm')]: {
      flexBasis: '100%'
    },
    [theme.breakpoints.up('lg')]: {
      flexBasis: '33.33%'
    },
  }
}));

export default function Providers() {
  const classes = useStyles();
  const selectedService = useSelector(selectActiveFilter);
  const { response, performFetch } = useFetch(PROVIDERS)
  const { loading, data: profiles } = response;

  const filteredProfiles = useMemo(() => {
    if (!selectedService) {
      return profiles;
    }

    return profiles.filter(profile => {
      const { subspecialties = [] } = profile.attributes;

      return subspecialties.includes(selectedService);
    })
  }, [profiles, selectedService]);

  useEffect(() => {
    performFetch();
  }, []);

  if (loading || !profiles) {
    return (
      <Grid container justify="center">
        <CircularProgress />
      </Grid>
    )
  }

  return (
    <div className={classes.root}>
      {filteredProfiles
        .map(profile => (
          <div key={profile.id} className={classes.item}>
            <ProfileCard
              src={profile.attributes['card-image']}
              title={profile.attributes.name}
              subSpecialties={profile.attributes.subspecialties.join(', ')}
            />
          </div>
        ))}
    </div>
  )
}
